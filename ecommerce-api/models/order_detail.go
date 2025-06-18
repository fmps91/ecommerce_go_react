package models

import "gorm.io/gorm"

type OrderDetail struct {
    gorm.Model
    OrderID   uint    `gorm:"not null" json:"order_id"`
    ProductID uint    `gorm:"not null" json:"product_id"`
    Product   Product `gorm:"foreignKey:ProductID" json:"product"`
    Quantity  int     `gorm:"not null" json:"quantity"`
    Price     float64 `gorm:"type:decimal(10,2);not null" json:"price"`
}