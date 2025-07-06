package controllers

import (
    "net/http"
    "fmt"
    "github.com/fmps92/ecommerce-api/models"
    "github.com/fmps92/ecommerce-api/utils"
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

type AuthController struct {
    DB *gorm.DB
}

func NewAuthController(db *gorm.DB) *AuthController {
    return &AuthController{DB: db}
}

type SignUpInput struct {
    Name     string `json:"name" binding:"required"`
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required,min=8"`
}

type SignInInput struct {
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required,min=8"`
}

func (ac *AuthController) SignUpUser(c *gin.Context) {
    var input SignUpInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, models.Response{
            Status: http.StatusBadRequest,
            Error:  "Validation error",
            Detail: err.Error(),
        })
        return
    }

    var existingUser models.User
    if err := ac.DB.Where("email = ?", input.Email).First(&existingUser).Error; err == nil {
        c.JSON(http.StatusConflict, models.Response{
            Status: http.StatusConflict,
            Error:  "Email already in use",
        })
        return
    }

    user := models.User{
        Name:     input.Name,
        Email:    input.Email,
        IsAdmin:  false,
    }

    

    if err := user.HashPassword(input.Password); err != nil {
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: http.StatusInternalServerError,
            Error:  "Could not hash password",
        })
        return
    }

    if err := ac.DB.Create(&user).Error; err != nil {
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: http.StatusInternalServerError,
            Error:  "Could not create user",
        })
        return
    }

    token, err := utils.GenerateToken(user)
    if err != nil {
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: http.StatusInternalServerError,
            Error:  "Could not generate token",
        })
        return
    }

    c.JSON(http.StatusCreated, models.Response{
        Status: http.StatusCreated,
        Data:   gin.H{"token": token,"username":user.Name},
        Detail: "function SignUpUser",
    })
}

func (ac *AuthController) SignInUser(c *gin.Context) {
    var input SignInInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, models.Response{
            Status: http.StatusBadRequest,
            Error:  "Validation error",
            Detail: err.Error(),
        })
        return
    }

    var user models.User
    if err := ac.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
        c.JSON(http.StatusNotFound, models.Response{
            Status: http.StatusNotFound,
            Error:  "User not found",
        })
        return
    }

    if err := user.CheckPassword(input.Password); err != nil {
        c.JSON(http.StatusUnauthorized, models.Response{
            Status: http.StatusUnauthorized,
            Error:  "Invalid credentials",
        })
        return
    }

    token, err := utils.GenerateToken(user)
    if err != nil {
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: http.StatusInternalServerError,
            Error:  "Could not generate token",
        })
        return
    }

    c.JSON(http.StatusOK, models.Response{
        Status: http.StatusOK,
        Data:   gin.H{"token": token,"username":user.Name},
        Detail: "function SignInUser",
    })
}

func (ac *AuthController) GetMe(c *gin.Context) {
    userID, exists := c.Get("userID")
    if !exists {
        c.JSON(http.StatusUnauthorized, models.Response{
            Status: http.StatusUnauthorized,
            Error:  "Unauthorized",
        })
        return
    }

    var user models.User
    if err := ac.DB.First(&user, userID).Error; err != nil {
        c.JSON(http.StatusNotFound, models.Response{
            Status: http.StatusNotFound,
            Error:  "User not found",
        })
        return
    }

    /* data:= gin.H{
        "id": user.ID,
        "email": user.Email,
        "name": user.Name,
        "is_admin": user.is_admin
    } */

    c.JSON(http.StatusOK, models.Response{
        Status: http.StatusOK,
        Data:   user,
        //Data: user,
        Detail: "function GetMe",
    })
}

func (ac *AuthController) UpdateUser(c *gin.Context) {
    // 1. Obtener userID del contexto
    userID, exists := c.Get("userID")
    if !exists {
        c.JSON(http.StatusUnauthorized, models.Response{
            Status: http.StatusUnauthorized,
            Error:  "Unauthorized",
        })
        return
    }

    // 2. Validar entrada
    var input SignUpInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, models.Response{
            Status: http.StatusBadRequest,
            Error:  "Validation error",
            Detail: err.Error(),
        })
        return
    }

    // 3. Buscar usuario existente
    var user models.User
    if err := ac.DB.First(&user, userID).Error; err != nil {
        c.JSON(http.StatusNotFound, models.Response{
            Status: http.StatusNotFound,
            Error:  "User not found",
            Detail: "auth function UpdateUser",
        })
        return
    }

    // 4. Debug: Imprimir datos antes de actualizar
    fmt.Printf("User before update: %+v\n", user)
    fmt.Printf("Update data - Name: %s, Email: %s\n", input.Name, input.Email)

    // 5. Preparar actualización
    updateData := map[string]interface{}{
        "Name":  input.Name,
        "Email": input.Email,
    }

    // 6. Si hay password, actualizarlo
    if input.Password != "" {
        user.HashPassword(input.Password)
        updateData["Password"] = user.Password
    }

    // 7. Ejecutar actualización
    if err := ac.DB.Model(&user).Updates(updateData).Error; err != nil {
        fmt.Printf("Update error: %v\n", err) // Log del error SQL
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: http.StatusInternalServerError,
            Error:  "Could not update user",
            Detail: err.Error(), // Mostrar el error real
        })
        return
    }

    // 8. Obtener usuario actualizado para respuesta
    ac.DB.First(&user, userID) // Refrescar datos
    fmt.Printf("User after update: %+v\n", user)

    c.JSON(http.StatusOK, models.Response{
        Status: http.StatusOK,
        Data:   user,
        Detail: "User updated successfully",
    })
}