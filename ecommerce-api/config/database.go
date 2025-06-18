package config

import (
    "fmt"
    "log"
    "os"
    "github.com/fmps92/ecommerce-api/models" // Agregar esta línea
    "github.com/joho/godotenv"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

	//var DSN = "host=localhost user=postgres password=postgres dbname=gorm port=5432"

    dsn := fmt.Sprintf(
        "host=%s user=%s password=%s dbname=%s port=%s",
        os.Getenv("DB_HOST"),
        os.Getenv("DB_USER"),
        os.Getenv("DB_PASSWORD"),
        os.Getenv("DB_NAME"),
        os.Getenv("DB_PORT"),
    )

    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        panic("Failed to connect to database!")
    }

    DB = db

    // AutoMigrate models
    err = db.AutoMigrate(
        &models.User{},
        &models.Product{},
        &models.Image{},
        &models.Order{},
        &models.OrderDetail{},
    )
    if err != nil {
        log.Fatal("Failed to migrate database!")
    }

    fmt.Println("Database connection successfully opened")
}

func MigrateDB() {
	err := DB.AutoMigrate(
		&models.User{},
		&models.Product{},
		&models.Order{},
		&models.OrderDetail{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	fmt.Println("Database migration completed")
}