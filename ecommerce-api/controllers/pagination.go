package controllers

import (
    "github.com/fmps92/ecommerce-api/models"
    "gorm.io/gorm"
)

type Pagination struct {
    Page     int `form:"page" json:"page"`
    PageSize int `form:"pageSize" json:"pageSize"`
}

func (p *Pagination) Paginate(db *gorm.DB, model interface{}) (*gorm.DB, *models.Response) {
    if p.Page <= 0 {
        p.Page = 1
    }

    switch {
    case p.PageSize > 100:
        p.PageSize = 100
    case p.PageSize <= 0:
        p.PageSize = 10
    }

    offset := (p.Page - 1) * p.PageSize
    return db.Offset(offset).Limit(p.PageSize), nil
}