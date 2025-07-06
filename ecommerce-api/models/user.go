package models

import (
    "golang.org/x/crypto/bcrypt"
    "gorm.io/gorm"
)

type User struct {
    gorm.Model
    Name     string `gorm:"size:255;not null" json:"name"`
    Email    string `gorm:"size:255;not null; unique" json:"email" `
    Password string `gorm:"size:255;not null" json:"password" binding:"min=8"`
    IsAdmin  bool   `gorm:"default:false" json:"is_admin"`
}

func (user *User) HashPassword(password string) error {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
    if err != nil {
        return err
    }
    user.Password = string(bytes)
    return nil
}

func (user *User) CheckPassword(providedPassword string) error {
    err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(providedPassword))
    if err != nil {
        return err
    }
    return nil
}