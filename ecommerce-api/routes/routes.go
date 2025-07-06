package routes

import (
    "github.com/fmps92/ecommerce-api/controllers"
    "github.com/fmps92/ecommerce-api/middlewares"
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
    "os"

)


func SetupRoutes(db *gorm.DB, corsMiddleware gin.HandlerFunc) *gin.Engine {
    r := gin.Default()
    
    //route check server
    r.GET("/", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "status":  200,
            "message": "ok",
        })
    })

    // Aplicar el middleware CORS
    r.Use(corsMiddleware)

    api := os.Getenv("SERVER_VERSION")
    
    // Initialize controllers
    authController := controllers.NewAuthController(db)
    userController := controllers.NewUserController(db)
    productController := controllers.NewProductController(db)
    orderController := controllers.NewOrderController(db)

    // Auth routes
    auth := r.Group(api+"/auth")
    {
        auth.POST("/signup", authController.SignUpUser)
        auth.POST("/signin", authController.SignInUser)
        auth.Use(middlewares.JWTMiddleware())
        {
        auth.PUT("/update", authController.UpdateUser)
        }
    }

    // User routes
	user := r.Group(api+"/users")
    user.Use(middlewares.JWTMiddleware())
    {
        user.GET("/me", authController.GetMe)
        user.GET("", middlewares.AdminMiddleware(), userController.GetUsers)
        user.GET("/:id", middlewares.AdminMiddleware(), userController.GetUser)
        user.PUT("/:id", middlewares.AdminMiddleware(), userController.UpdateUser)
        user.DELETE("/:id", middlewares.AdminMiddleware(), userController.DeleteUserDeleted_at)
        user.DELETE("/custom/:id", middlewares.AdminMiddleware(), userController.DeleteUserDatabase)
    }

    // Product routes
    product := r.Group(api+"/products")
    {
        product.GET("", productController.GetProducts)
        product.GET("/params",productController.GetProductsParams)
        product.GET("/:id", productController.GetProduct)
        
        // Protected routes
        product.Use(middlewares.JWTMiddleware())
        product.Use(middlewares.AdminMiddleware())
        {
            product.POST("", productController.CreateProduct)
            product.PUT("/:id", productController.UpdateProduct)
            product.DELETE("/:id", productController.DeleteProductDeleted_at)
            product.DELETE("/custom/:id", productController.DeleteProductDatabase)
        }
    }

    // Order routes
    order := r.Group(api+"/orders")
    order.Use(middlewares.JWTMiddleware())
    {
        order.POST("", orderController.CreateOrder)
        order.GET("", orderController.GetOrders)
        order.GET("/:id", orderController.GetOrder)
        
        // Admin only routes
        order.Use(middlewares.AdminMiddleware())
        {
            order.PUT("/:id", orderController.UpdateOrder)
            order.DELETE("/:id", orderController.DeleteOrderDeleted_at)
            order.DELETE("/custom/:id", orderController.DeleteOrderDatabase)
        }
    }

    return r
}