package models

import "gorm.io/gorm"

type Image struct {
    gorm.Model
    Data        []byte `gorm:"type:bytea"`
    ContentType string `gorm:"size:100"`
    IsPrimary   bool   `gorm:"default:false" json:"is_primary"`
    ProductID   uint // Clave foránea
}