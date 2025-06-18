package utils

import (
    "time"
    "github.com/golang-jwt/jwt/v4"
	"github.com/fmps92/ecommerce-api/models"
	"os"

)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

func GenerateToken(user models.User) (string, error) {
    claims := jwt.MapClaims{
        "id":       user.ID,
        //"email":    user.Email,
        //"is_admin": user.IsAdmin,
        "exp":      time.Now().Add(time.Hour * 72).Unix(),
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(jwtSecret)
}

func ParseToken(tokenString string) (*jwt.Token, error) {
    return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        return jwtSecret, nil
    })
}