package tests_controllers


import (
	//"io"
	//"bytes"
	//"net/http"
	//"net/http/httptest"
	"testing"
	//"encoding/json"
	//"github.com/gin-gonic/gin"
    //"strings"
    "fmt"
    //"log"
    //"github.com/fmps92/ecommerce-api/routes"
	//"github.com/fmps92/ecommerce-api/controllers"
	"github.com/fmps92/ecommerce-api/models"
	"github.com/fmps92/ecommerce-api/utils"
    //"github.com/fmps92/ecommerce-api/config"
    "github.com/fmps92/ecommerce-api/tests_conf"
    //"github.com/stretchr/testify/assert"
    //"github.com/joho/godotenv"



)

var res map[string]interface{}
var token string
var url = "http://localhost:5000/api/v1"
var id string

func TestApis(t *testing.T) {
    
    //Auth controller
    /* t.Run("AuthRegisterUser", func(t1 *testing.T) {
        
        token = AuthRegisterUser(t, url) // Ahora la función retorna valores
        
        if token == "" {
            t.Fatal("AuthLoginUser fallo:")
        }
    }) */


    t.Run("AuthLoginUser", func(t1 *testing.T) {
        
        token = AuthLoginUser(t, url) // Ahora la función retorna valores
        
        if token == "" {
            t.Fatal("AuthLoginUser fallo:")
        }
    })

    fmt.Println("Token obtenido:", token)

    t.Run("AuthUpdateUser", func(t *testing.T) {
        
        res = AuthUpdateUser(t,token,url) // Ahora la función retorna valores
    })


    //User controller
    t.Run("UserGetMe", func(t1 *testing.T) {
        
        res = UserGetMe(t,token,url) // Ahora la función retorna valores
        idStr , err := utils.InterfaceToType(res["id"])
        if err != nil {
            t.Fatal("UserGetMe fallo:")
        }

        tests_conf.SetupTestDB()
        db:=tests_conf.TestDB

        if err := db.Model(&models.User{}).Where("id = ?", idStr).Updates(&models.User{IsAdmin: true}).Error; err != nil {
            t.Fatal("UserGetMe update user fallo:")
        }

        tests_conf.CloseTestDB()
        id=idStr
        //fmt.Println("res en function:", res)
        fmt.Println("res id:", id)
    
    })

    t.Run("UserGetUser", func(t1 *testing.T) {
   
        res = UserGetUser(t,id,token,url) // Ahora la función retorna valores
        fmt.Println("res en function UserGetUser:", res)
    
    })


    t.Run("UserUpdateUser", func(t1 *testing.T) {
   
        res = UserUpdateUser(t,id,token,url) // Ahora la función retorna valores
        fmt.Println("res en function UserUpdateUser:", res)
    
    })

    t.Run("UserGetUsers", func(t1 *testing.T) {
        
        UserGetUsers(t,token,url) // Ahora la función retorna valores
        //fmt.Println("res en function UserGetUsers:", res)
    
    })


    

    
    //Product controller

    t.Run("ProductCreateProduct", func(t1 *testing.T) {
   
        res = ProductCreateProduct(t,token,url) // Ahora la función retorna valores
        fmt.Println("res en function ProductCreateProduct:", res)
    
    })

    /* t.Run("UserGetUsers", func(t1 *testing.T) {
        
        res:=UserGetUsers(t,token,url) // Ahora la función retorna valores
        fmt.Println("res en function UserGetUsers:", res)
    
    }) */




    //User controller delete User
    /* t.Run("UserDeleteUserDeleted_at", func(t1 *testing.T) {
   
        UserDeleteUserDeleted_at(t,id,token,url) // Ahora la función retorna valores
        //fmt.Println("res en function UserDeleteUserDeleted_at:", res)
    
    }) 

    t.Run("UserDeleteUserDatabase", func(t1 *testing.T) {
        
        UserDeleteUserDatabase(t,id,token,url) // Ahora la función retorna valores
        //fmt.Println("res en function UserDeleteUserDatabase:", res)
    
    }) */

}

