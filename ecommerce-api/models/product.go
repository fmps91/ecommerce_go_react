package models

import "gorm.io/gorm"

// Product representa la entidad principal del producto
type Product struct {
    gorm.Model
    Name        string   `gorm:"size:255;not null" json:"name"`
    Description string   `gorm:"size:1024" json:"description"`
    Category    string   `gorm:"size:255" json:"category"`
    Price       float64  `gorm:"type:decimal(10,2);not null" json:"price"`
    Stock       int      `gorm:"not null" json:"stock"`
    Images      []Image  `gorm:"foreignKey:ProductID" json:"images"` // Relación uno-a-muchos
}
