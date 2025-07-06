package tests_controllers


import (
    "io"
    //"fmt"
	"bytes"
	"net/http"
	//"net/http/httptest"
	"testing"
	"encoding/json"
	//"github.com/gin-gonic/gin"
    //"strings"
    //"log"
    //"github.com/fmps92/ecommerce-api/routes"
	//"github.com/fmps92/ecommerce-api/controllers"
	"github.com/fmps92/ecommerce-api/models"
	//"github.com/fmps92/ecommerce-api/utils"
	//"github.com/fmps92/ecommerce-api/config"
    "github.com/stretchr/testify/assert"
    //"github.com/joho/godotenv"


)


func UserGetMe(t *testing.T,token string,url string) (map[string]interface{}){

    // Crea una petición
    req, err := http.NewRequest(http.MethodGet,url+"/users/me",nil)
    assert.NoError(t, err,"error en crear la peticion ") 
    req.Header.Set("Content-Type", "application/json")
    // Poner el token en la request
    req.Header.Set("Authorization", "Bearer "+token)

    // Ejecutar petición
    client := http.Client{}
    resp, err := client.Do(req)
    assert.NoError(t, err,"error en ejecutar petición ") 

    // Leer el cuerpo de la respuesta
    bodyBytes, err := io.ReadAll(resp.Body)
    assert.NoError(t, err,"leer bodyBytes")

    var result map[string]interface{}
    err = json.Unmarshal(bodyBytes, &result)
    assert.NoError(t, err)

    dataField, ok := result["data"].(map[string]interface{})
    assert.True(t, ok, "el campo 'data' no es un mapa válido")

    assert.NoError(t, err)
    defer resp.Body.Close()
 
     // Verificar respuesta
     assert.Equal(t, http.StatusOK, resp.StatusCode)

     return dataField
}



func UserGetUser(t *testing.T, id string, token string, url string) (map[string]interface{}){

     // Crea una petición POST a /api/auth/register (ajusta el endpoint real)
     req, err := http.NewRequest(http.MethodGet,url+"/users/"+id, nil)
     assert.NoError(t, err)
     req.Header.Set("Content-Type", "application/json")
     // Poner el token en la request
     req.Header.Set("Authorization", "Bearer "+token)
 
     // Ejecutar petición
     client := http.Client{}
     resp, err := client.Do(req)
     
     // Leer el cuerpo de la respuesta
     bodyBytes, err := io.ReadAll(resp.Body)
     assert.NoError(t, err)
 
     // Convertir a string para imprimirlo
     //bodyString := string(bodyBytes)
     //fmt.Println("Response Body:", bodyString)
 
     var result map[string]interface{}
     err = json.Unmarshal(bodyBytes, &result)
     assert.NoError(t, err)

     //fmt.Println("Response Body:", result)
     // Acceder al campo "data"
     
     dataField, ok := result["data"].(map[string]interface{})
     assert.True(t, ok, "el campo 'data' no es un mapa válido")

     assert.NoError(t, err)
     defer resp.Body.Close()
 
     // Verificar respuesta
     assert.Equal(t, http.StatusOK, resp.StatusCode)

     if http.StatusOK != resp.StatusCode {  
        t.Fatal("UserGetUser fallo:")
     }

     return dataField
}

func UserUpdateUser(t *testing.T, id string , token string, url string) (map[string]interface{}){

    body := models.User{
        Name:     "Test User2",
        Email:    "testme@example.com",
        Password: "password123",
        IsAdmin: true,
    }

    // Codificar el cuerpo como JSON
	jsonBody, err := json.Marshal(body)
	assert.NoError(t, err)

     // Crea una petición POST a /api/auth/register (ajusta el endpoint real)
     req, err := http.NewRequest(http.MethodPut,url+"/users/"+id, bytes.NewBuffer(jsonBody))
     assert.NoError(t, err)
     req.Header.Set("Content-Type", "application/json")
     // Poner el token en la request
     req.Header.Set("Authorization", "Bearer "+token)
 
     // Ejecutar petición
     client := http.Client{}
     resp, err := client.Do(req)
     
     // Leer el cuerpo de la respuesta
     bodyBytes, err := io.ReadAll(resp.Body)
     assert.NoError(t, err)
 
     // Convertir a string para imprimirlo
     //bodyString := string(bodyBytes)
     //fmt.Println("Response Body:", bodyString)
 
     var result map[string]interface{}
     err = json.Unmarshal(bodyBytes, &result)
     assert.NoError(t, err)

     // Acceder al campo "data"
     dataField, ok := result["data"].(map[string]interface{})
     assert.True(t, ok, "el campo 'data' no es un mapa válido")

     assert.NoError(t, err)
     defer resp.Body.Close()
 
     // Verificar respuesta
     assert.Equal(t, http.StatusOK, resp.StatusCode)

     if http.StatusOK != resp.StatusCode {  
        t.Fatal("UserUpdateUser fallo:")
     }

     return dataField
}

func UserDeleteUserDeleted_at(t *testing.T, id string , token string, url string){


     // Crea una petición POST a /api/auth/register (ajusta el endpoint real)
     req, err := http.NewRequest(http.MethodDelete,url+"/users/"+id, nil)
     assert.NoError(t, err)
     req.Header.Set("Content-Type", "application/json")
     // Poner el token en la request
     req.Header.Set("Authorization", "Bearer "+token)
 
     // Ejecutar petición
     client := http.Client{}
     resp, err := client.Do(req)
     

     assert.NoError(t, err)
     defer resp.Body.Close()
 
     // Verificar respuesta
     assert.Equal(t, http.StatusOK, resp.StatusCode)

     if http.StatusOK != resp.StatusCode {  
        t.Fatal("UserDeleteUserDeleted_at fallo:")
     }


}


func UserDeleteUserDatabase(t *testing.T, id string , token string, url string){


    // Crea una petición
    req, err := http.NewRequest(http.MethodDelete,url+"/users/custom/"+id, nil)
    assert.NoError(t, err)
    req.Header.Set("Content-Type", "application/json")
    // Poner el token en la request
    req.Header.Set("Authorization", "Bearer "+token)

    // Ejecutar petición
    client := http.Client{}
    resp, err := client.Do(req)
    


    assert.NoError(t, err)
    defer resp.Body.Close()

    //fmt.Println("http: ",http.StatusOK, "      resp: ",resp.StatusCode)
    // Verificar respuesta
    assert.Equal(t, http.StatusOK, resp.StatusCode)

    if http.StatusOK != resp.StatusCode {  
       t.Fatal("UserDeleteUserDatabase fallo:")
    }

}

func UserGetUsers(t *testing.T,token string, url string) (interface{}){


    // Crea una petición POST a /api/auth/register (ajusta el endpoint real)
    req, err := http.NewRequest(http.MethodGet,url+"/users", nil)
    assert.NoError(t, err,"error en la req")
    req.Header.Set("Content-Type", "application/json")
    // Poner el token en la request
    req.Header.Set("Authorization", "Bearer "+token)

	// Ejecutar petición
	client := http.Client{}
    resp, err := client.Do(req)
    
    
    // Leer el cuerpo de la respuesta
    bodyBytes, err := io.ReadAll(resp.Body)
    assert.NoError(t, err,"leer bodyBytes")


    var result map[string]interface{}
    err = json.Unmarshal(bodyBytes, &result)
    assert.NoError(t, err)

     // Acceder al campo "data"
    dataField, ok := result["data"]
    assert.True(t, ok, "el campo 'data' no es un mapa válido")

    assert.NoError(t, err)
    defer resp.Body.Close()
 
     // Verificar respuesta
     assert.Equal(t, http.StatusOK, resp.StatusCode)

     if http.StatusOK != resp.StatusCode {  
        t.Fatal("UserGetUsers fallo:")
     }

     return dataField
}


