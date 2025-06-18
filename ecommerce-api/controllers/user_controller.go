package controllers

import (
    "net/http"
    "github.com/fmps92/ecommerce-api/models"
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

type UserController struct {
    DB *gorm.DB
}

func NewUserController(db *gorm.DB) *UserController {
    return &UserController{DB: db}
}

type UpdateUser struct {
    Name     string `json:"name" binding:"required"`
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required,min=8"`
    IsAdmin  bool   `json:"is_admin""`
}


func (uc *UserController) GetUsers(c *gin.Context) {
    var pagination Pagination
    if err := c.ShouldBindQuery(&pagination); err != nil {
        c.JSON(http.StatusBadRequest, models.Response{
            Status: http.StatusBadRequest,
            Error:  "Invalid pagination parameters",
        })
        return
    }

    var users []models.User
    db, resp := pagination.Paginate(uc.DB, &users)
    if resp != nil {
        c.JSON(resp.Status, resp)
        return
    }

    if err := db.Find(&users).Error; err != nil {
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: http.StatusInternalServerError,
            Error:  "Could not fetch users",
        })
        return
    }

    c.JSON(http.StatusOK, models.Response{
        Status: http.StatusOK,
        Data:   users,
        Detail: "function GetUsers",
    })
}

func (uc *UserController) GetUser(c *gin.Context) {
    id := c.Param("id")

    var user models.User
    if err := uc.DB.First(&user, id).Error; err != nil {
        c.JSON(http.StatusNotFound, models.Response{
            Status: http.StatusNotFound,
            Error:  "User not found",
            Detail: "function GetUser",
        })
        return
    }

    c.JSON(http.StatusOK, models.Response{
        Status: http.StatusOK,
        Data:   user,
        Detail: "function GetUser",
    })
}

func (uc *UserController) UpdateUser(c *gin.Context) {
    id := c.Param("id")

    var input UpdateUser
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, models.Response{
            Status: http.StatusBadRequest,
            Error:  "Validation error",
            Detail: err.Error(),
        })
        return
    }

    var user models.User
    if err := uc.DB.First(&user, id).Error; err != nil {
        c.JSON(http.StatusNotFound, models.Response{
            Status: http.StatusNotFound,
            Error:  "User not found",
        })
        return
    }

    user.HashPassword(input.Password)

    if err := uc.DB.Model(&user).Updates(models.User{
        Name:  input.Name,
        Email: input.Email,
        Password: user.Password,
        IsAdmin: input.IsAdmin,
    }).Error; err != nil {
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: http.StatusInternalServerError,
            Error:  "Could not update user",
        })
        return
    }

    c.JSON(http.StatusOK, models.Response{
        Status: http.StatusOK,
        Data:   user,
        Detail: "function UpdateUser",
    })
}

func (uc *UserController) DeleteUserDeleted_at(c *gin.Context) {
    id := c.Param("id")

    if err := uc.DB.Delete(&models.User{}, id).Error; err != nil {
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: http.StatusInternalServerError,
            Error:  "Could not delete user",
        })
        return
    }

    c.JSON(http.StatusOK, models.Response{
        Status: http.StatusOK,
        Data:   "User deleted successfully",
        Detail: "function DeleteUserDeleted_at",
    })
}

func (uc *UserController) DeleteUserDatabase(c *gin.Context) {
    id := c.Param("id")
    

    // 2. Buscar el usuario (incluyendo eliminados lógicos si es necesario)
    var user models.User
    query := uc.DB.Unscoped().Where("id = ?", id).First(&user)
    
    if query.Error != nil {
        c.JSON(http.StatusNotFound, models.Response{
            Status: http.StatusNotFound,
            Error:  "User not found",
        })
        return
    }

    // 3. Eliminación definitiva
    result := uc.DB.Unscoped().Delete(&user)
    
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: http.StatusInternalServerError,
            Error:  "Database error: " + result.Error.Error(),
        })
        return
    }

    if result.RowsAffected == 0 {
        c.JSON(http.StatusConflict, models.Response{
            Status: http.StatusConflict,
            Error:  "User could not be deleted (no rows affected)",
        })
        return
    }

    // 4. Respuesta exitosa
    c.JSON(http.StatusOK, models.Response{
        Status: http.StatusOK,
        Data:   map[string]interface{}{
            "message": "User deleted successfully",
            "user_id": id,
        },
        Detail: "function DeleteUserDatabase",
    })
}