package controllers

import (
    "net/http"
    "github.com/fmps92/ecommerce-api/models"
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
    "strings"
    "strconv"
    "fmt"

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
    IsAdmin  bool   `json:"is_admin"`
}



func (uc *UserController) GetUsers(c *gin.Context) {
    // Definimos la estructura de parámetros dentro de la función

    page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
    if page < 1 {
        page = 1
    }

    pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))
    if pageSize < 1 || pageSize > 21 {
        pageSize = 10
    }

    params := struct {
        Name     string
        SortBy   string
        Order    string
        Email    string
        IsAdmin  string
    }{
        Name:     c.DefaultQuery("name", ""),
        SortBy:   c.DefaultQuery("sort_by", "created_at"),
        Order:    strings.ToLower(c.DefaultQuery("order", "desc")),
        Email:    strings.ToLower(strings.TrimSpace(c.DefaultQuery("email", ""))),
        IsAdmin:  strings.ToLower(strings.TrimSpace(c.DefaultQuery("isAdmin", ""))),    
    }

    // Iniciar la consulta
    query := uc.DB.Model(&models.User{})
    
    // Aplicar filtros con LOWER para búsqueda case-insensitive
    if params.Email != "" {
        email := strings.ToLower(params.Email)
        query = query.Where("LOWER(email) LIKE LOWER(?)", "%"+email+"%")
    }
    
    if params.Name != "" {
        name := strings.ToLower(params.Name)
        query = query.Where("LOWER(name) LIKE LOWER(?)", "%"+name+"%")
    }
    
    fmt.Println("isAdmin: ",params.IsAdmin)
    if params.IsAdmin != "" {
        query = query.Where("is_admin = ?", params.IsAdmin)
    }
    
    query = query.Order(fmt.Sprintf("%s %s", params.SortBy, params.Order))

    // Contar el total sin paginación para la metadata
    var total int64
    if err := query.Count(&total).Error; err != nil {
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: http.StatusInternalServerError,
            Error:  err.Error(),
            Detail: "Error counting products function GetProductsParams",
        })
        return
    }

    offset := (page - 1) * pageSize
    query = query.Offset(offset).Limit(pageSize)

    // Ejecutar la consulta
    var users []models.User
    if err := query.Find(&users).Error; err != nil {
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: http.StatusInternalServerError,
            Error:  "Could not fetch users",
            Detail: "function GetUsers",
        })
        return
    }

    totalPages := (total + int64(pageSize) - 1) / int64(pageSize)

    c.JSON(http.StatusOK, models.Response{
        Status: http.StatusOK,
        Data: gin.H{
            "users": users,
            "pagination": gin.H{
                "page":       page,
                "pageSize":  pageSize,
                "total_items":  total,
                "total_pages": totalPages,
            },
            "sort": gin.H{
                "by":    params.SortBy,
                "order": params.Order,
            },
            "filters": gin.H{
                "name":     params.Name,
                "email":    params.Email,
                "is_admin": params.IsAdmin,
            },
        },
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
            Error:  "Validation error: "+err.Error(),
            Detail: "function UpdateUser",
        })
        return
    }

    var user models.User
    if err := uc.DB.First(&user, id).Error; err != nil {
        c.JSON(http.StatusNotFound, models.Response{
            Status: http.StatusNotFound,
            Error:  "User not found",
            Detail: "function UpdateUser",
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
            Detail: "function UpdateUser",
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
            Detail: "function DeleteUserDatabase",
        })
        return
    }

    // 3. Eliminación definitiva
    result := uc.DB.Unscoped().Delete(&user)
    
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: http.StatusInternalServerError,
            Error:  "Database error: " + result.Error.Error(),
            Detail: "function DeleteUserDatabase",
        })
        return
    }

    if result.RowsAffected == 0 {
        c.JSON(http.StatusConflict, models.Response{
            Status: http.StatusConflict,
            Error:  "User could not be deleted (no rows affected)",
            Detail: "function DeleteUserDatabase",
        })
        return
    }

    // 4. Respuesta exitosa
    c.JSON(http.StatusOK, models.Response{
        Status: http.StatusOK,
        Data:   "User deleted of database successfully",
        Detail: "function  DeleteUserDatabase",
    })
}