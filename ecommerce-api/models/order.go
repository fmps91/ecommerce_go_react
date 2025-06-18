package models

import "gorm.io/gorm"

type Order struct {
    gorm.Model
    UserID      uint          `gorm:"not null" json:"user_id"`
    User        User          `gorm:"foreignKey:UserID" json:"-"`
    Total       float64       `gorm:"type:decimal(10,2);not null" json:"total"`
    Status      string        `gorm:"size:50;not null" json:"status"`
    OrderDetails []OrderDetail `gorm:"foreignKey:OrderID" json:"order_details"`
}