package tests_conf

import (
    "testing"
    //"github.com/stretchr/testify/assert"
    //"fmt"
    //"log"
    "os"
    //"github.com/fmps92/ecommerce-api/models" // Agregar esta línea
    //"github.com/joho/godotenv"
    //"gorm.io/driver/postgres"
    //"gorm.io/gorm"
)


func TestMain(m *testing.M) {
    // Setup
    SetupTestDB()
    
    // Ejecutar tests
    code := m.Run()
    
    // Cleanup (opcional)
    // cleanupTestDB()
    
    os.Exit(code)
}

