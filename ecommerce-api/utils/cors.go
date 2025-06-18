package utils

import (
	"time"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// Devuelve solo el middleware, no el router completo
func GetCorsConfig() gin.HandlerFunc {
	return cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	})
}

func GetCorsDev() gin.HandlerFunc {
    return cors.New(cors.Config{
        AllowAllOrigins: true,
        AllowMethods:    []string{"*"},
		AllowHeaders:    []string{"*"},
		ExposeHeaders:    []string{"*"},
    })
}

/* package utils

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func GetCorsConfig() *gin.Engine {
    r := gin.Default()

	r.Use(
	cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3001"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	return r
}

// Versión simplificada para desarrollo
func GetCorsDev() *gin.Engine {
    r := gin.Default()

	r.Use(cors.Default()) // Permite todo en desarrollo


    r.Use(cors.New(cors.Config{
        AllowAllOrigins:  true,
        AllowMethods:     []string{"*"},
        AllowHeaders:     []string{"*"},
        ExposeHeaders:    []string{"*"},
        //AllowCredentials: true, // Esto debe ser false o eliminarse cuando AllowAllOrigins es true
        MaxAge:          12 * time.Hour,
    }))

    return r
} */


/* package utils

import (
    "time"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

)

func GetCorsConfig() gin.HandlerFunc {
    return cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3001"},
        AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    })
}


func GetCorsDev() gin.HandlerFunc {
    return cors.New(cors.Config{
        AllowAllOrigins: true,
        AllowMethods:    []string{"*"},
        AllowHeaders:    []string{"*"},
    })
} */