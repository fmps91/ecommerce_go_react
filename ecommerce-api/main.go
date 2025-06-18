package main

import (
    "github.com/fmps92/ecommerce-api/config"
    "github.com/fmps92/ecommerce-api/routes"
    "os"
    "fmt"
    "github.com/fmps92/ecommerce-api/utils"
)


// Uso:


func main() {
	// Initialize database
	config.ConnectDB()
	
	// Elige la configuración CORS según el entorno
	corsMiddleware := utils.GetCorsConfig() // Para producción
	// corsMiddleware := utils.GetCorsDev() // Para desarrollo

	// Configura las rutas
	r := routes.SetupRoutes(config.DB, corsMiddleware)


    fmt.Println("routes init")

    // Start server
    port := os.Getenv("PORT")

    if port == "" {
        port = "5000" // Puerto por defecto
    }

    //v := utils.GetCorsConfig()

    
    fmt.Println("http://localhost:"+port)
    // Corrección: Solo usa el puerto, no la URL completa
    r.Run("localhost:"+port) // Escucha solo en localhost
    


}