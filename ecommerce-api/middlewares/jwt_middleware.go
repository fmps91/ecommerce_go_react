package middlewares

import (
    "fmt"
    "net/http"
    "strings"
    "github.com/fmps92/ecommerce-api/models"
    "github.com/fmps92/ecommerce-api/utils"
    "github.com/fmps92/ecommerce-api/config"
    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v4" // Importación añadida
)

func JWTMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.AbortWithStatusJSON(http.StatusUnauthorized, models.Response{
                Status: http.StatusUnauthorized,
                Error:  "Authorization header is required",
            })
            return
        }

        tokenString := strings.Split(authHeader, " ")[1]
        token, err := utils.ParseToken(tokenString)

        
        if err != nil || !token.Valid {
            c.AbortWithStatusJSON(http.StatusUnauthorized, models.Response{
                Status: http.StatusUnauthorized,
                Error:  "Invalid token",
            })
            return
        }

        claims := token.Claims.(jwt.MapClaims)
        
        // Convertir correctamente el valor is_admin
        /* isAdmin, ok := claims["is_admin"].(bool)
        if !ok {
            // Si no es bool, intentar convertir desde float64 (JSON numbers)
            if isAdminNum, ok := claims["is_admin"].(float64); ok {
                isAdmin = isAdminNum == 1
            } else {
                isAdmin = false
            }
        } */

        idFloat := claims["id"].(float64)
        
        c.Set("userID", uint(idFloat))
        //c.Set("userID", claims["id"])
        //c.Set("isAdmin", isAdmin) // Establecer como booleano
        c.Next()
    }
}

/* func AdminMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        isAdminValue, exists := c.Get("isAdmin")
        if !exists {
            c.AbortWithStatusJSON(http.StatusForbidden, models.Response{
                Status: http.StatusForbidden,
                Error:  "Admin status not found",
            })
            return
        }
        //fmt.Println("paso1 variables: ",isAdminValue, "    ",exists)
        isAdmin, ok := isAdminValue.(bool)
        if !ok {
            c.AbortWithStatusJSON(http.StatusForbidden, models.Response{
                Status: http.StatusForbidden,
                Error:  "Invalid admin status format",
            })
            return
        }

        //fmt.Println("paso2 variables: ",isAdmin, "    ",ok)

        if !isAdmin {
            c.AbortWithStatusJSON(http.StatusForbidden, models.Response{
                Status: http.StatusForbidden,
                Error:  "Admin access required",
            })
            return
        }
        c.Next()
    }
} */

func AdminMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        id, exists := c.Get("userID")
        if !exists {
            c.AbortWithStatusJSON(http.StatusForbidden, models.Response{
                Status: http.StatusForbidden,
                Error:  "Admin status not found",
            })
            return
        }
        
        /* var user models.User
        if err := config.DB.First(&user, isAdminValue).Error; err != nil {
            c.JSON(http.StatusNotFound, models.Response{
                Status: http.StatusNotFound,
                Error:  "User not found",
                Detail: "Error in find User ",
            })
            return
        } */

        var user models.User // Asumiendo que tienes un modelo User
        err := config.DB.Raw("SELECT * FROM users WHERE id = ?", id).Scan(&user).Error

        if err != nil {
            
            // Para otros tipos de errores de base de datos
            c.JSON(http.StatusInternalServerError, models.Response{
                Status: http.StatusInternalServerError,
                Error:  "Database error",
                Detail: fmt.Sprintf("Error searching for admin user: %v", err),
            })
            return
        }

        //fmt.Println("user admin: ",user)
        //fmt.Println("print admin: ",user.IsAdmin)

        if !user.IsAdmin {
            c.AbortWithStatusJSON(http.StatusForbidden, models.Response{
                Status: http.StatusForbidden,
                Error:  "Admin access required",
            })
            return
        }
        c.Next()
    }
}