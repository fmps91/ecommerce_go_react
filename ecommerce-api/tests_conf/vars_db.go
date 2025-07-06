package tests_conf

import (
    "database/sql"
    "testing"
    "github.com/stretchr/testify/assert"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

var TestDB *gorm.DB
var SqlDB *sql.DB // Exportado con mayúscula si necesitas acceder desde fuera

func SetupTestDB() {
    dsn := "host=localhost user=postgres password=postgres dbname=apigo port=5432"
    
    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        panic("Failed to connect to database!")
    }
    
    // Obtenemos el *sql.DB subyacente
    sqlDB, err := db.DB()
    if err != nil {
        panic("Failed to get underlying database connection!")
    }
    
    TestDB = db
    SqlDB = sqlDB // Asignamos a la variable exportada
}

func CloseTestDB() {
    if SqlDB != nil {
        SqlDB.Close()
    }
}

func TestDatabaseConnection(t *testing.T) {
    SetupTestDB()
    defer CloseTestDB()
    
    assert.NotNil(t, TestDB, "DB connection should not be nil")
    assert.NotNil(t, SqlDB, "Underlying DB connection should not be nil")
    
    err := SqlDB.Ping()
    assert.NoError(t, err, "Should be able to ping database")
}