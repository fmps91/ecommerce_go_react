package tests_controllers

import (

	//"fmt"
	"os"
	"testing"
    //"github.com/gin-gonic/gin"

    //"gorm.io/driver/postgres"
    //"github.com/fmps92/ecommerce-api/tests_conf"
    //"github.com/stretchr/testify/assert"

)


func TestMain(m *testing.M) {
    //gin.SetMode("debug")   // igual a gin.DebugMode
    //gin.SetMode("release") // igual a gin.ReleaseMode
    //gin.SetMode("test")
    //config.ConnectDB()
    //fmt.Println("Modo actual:", gin.Mode())
    //os.Exit(m.Run())               // Ejecutar todos los tests
    
    // Ejecutar tests
    code := m.Run()
    
    // Cleanup (opcional)
    // cleanupTestDB()
    
    os.Exit(code)
}

