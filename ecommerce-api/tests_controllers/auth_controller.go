package tests_controllers


import (
	"io"
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


func AuthRegisterUser(t *testing.T, url string) (string) {

   body := models.User{
        Name:     "Test User",
        Email:    "testme@example.com",
        Password: "password123",
    }

    // Codificar el cuerpo como JSON
	jsonBody, err := json.Marshal(body)
	assert.NoError(t, err)
    // Prepara el cuerpo JSON

    // Crea una petición 
    req, err := http.NewRequest(http.MethodPost,url+"/auth/signup", bytes.NewBuffer(jsonBody))
    assert.NoError(t, err,"error en la req")
	req.Header.Set("Content-Type", "application/json")

	// Ejecutar petición
	client := http.Client{}
    resp, err := client.Do(req)
    assert.NoError(t, err,"no error en la peticion")
    
    // Leer el cuerpo de la respuesta
    bodyBytes, err := io.ReadAll(resp.Body)
    assert.NoError(t, err,"leer bodyBytes")

    // Convertir a string para imprimirlo
    //bodyString := string(bodyBytes)
    //fmt.Println("Response Body:", bodyString)

    var result map[string]interface{}
    err = json.Unmarshal(bodyBytes, &result)
    assert.NoError(t, err)

    // Acceder al campo "data"
    //dataField := result["data"]
    // Verificación segura del token
    dataField, ok := result["data"].(map[string]interface{})
    assert.True(t, ok, "el campo 'data' no es un mapa válido")
    
    token, ok := dataField["token"].(string)
    assert.True(t, ok, "el token no es un string válido")
    //fmt.Println("Data completo:", dataField)
    //fmt.Println("Token:", dataField["token"])
    //fmt.Println("Username:", dataField["username"])

    //response.Data = dataField["token"]
    //response.Status = resp.StatusCode
    //response.TypeError = err

    //fmt.Println("resp: ",response.Data["data"])
    //fmt.Println("resp: ",response.Data)
	assert.NoError(t, err)
	defer resp.Body.Close()

    // Verificar respuesta
    assert.Equal(t, http.StatusCreated, resp.StatusCode)

    return token
	//Verificar respuesta
    //assert.Equal(t, http.StatusCreated, resp.StatusCode)
    
    
}


func AuthLoginUser(t *testing.T,url string) (string){

    body := models.User{
         Email:    "testme@example.com",
         Password: "password123",
    }
 
     // Codificar el cuerpo como JSON
     jsonBody, err := json.Marshal(body)
     assert.NoError(t, err)
     // Prepara el cuerpo JSON
 
     // Crea una petición 
     req, err := http.NewRequest(http.MethodPost,url+"/auth/signin", bytes.NewBuffer(jsonBody))
     assert.NoError(t, err)
     req.Header.Set("Content-Type", "application/json")
 
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
     //dataField := result["data"]
     dataField, ok := result["data"].(map[string]interface{})
     assert.True(t, ok, "el campo 'data' no es un mapa válido")
     
     token, ok := dataField["token"].(string)
     assert.True(t, ok, "el token no es un string válido")
     //fmt.Println("Data completo:", dataField)
     //fmt.Println("Token:", dataField["token"])
     //fmt.Println("Username:", dataField["username"])
 
     //response.Data = dataField["token"]
     //response.Status = resp.StatusCode
     //response.TypeError = err
 
     //fmt.Println("resp: ",response.Data["data"])
     //fmt.Println("resp: ",response.Data)
     assert.NoError(t, err)
     defer resp.Body.Close()
 
     // Verificar respuesta
     assert.Equal(t, http.StatusOK, resp.StatusCode)

    return token
}

func AuthUpdateUser(t *testing.T, token string,url string) (map[string]interface{}) {
    body := models.User{
        Name:     "Test User1",
        Email:    "testme@example.com",
        Password: "password123",
    }

    jsonBody, err := json.Marshal(body)
     assert.NoError(t, err)
     // Prepara el cuerpo JSON
 
     // Crea una petición
     req, err := http.NewRequest(http.MethodPut,url+"/auth/update", bytes.NewBuffer(jsonBody))
     assert.NoError(t, err) 
     req.Header.Set("Content-Type", "application/json")
     // Poner el token en la request
	req.Header.Set("Authorization", "Bearer "+token)
 
     // Ejecutar petición
     client := http.Client{}
     resp, err := client.Do(req)
     assert.NoError(t, err)
     
     // Leer el cuerpo de la respuesta
     bodyBytes, err := io.ReadAll(resp.Body)
     assert.NoError(t, err)
 
     // Convertir a string para imprimirlo
     //bodyString := string(bodyBytes)
     //fmt.Println("Response Body:", bodyString)
 
     var result map[string]interface{}
     err = json.Unmarshal(bodyBytes, &result)
     assert.NoError(t, err)

     //fmt.Println("resp: ",response.Data["data"])
     //fmt.Println("resp: ",response.Data)
     assert.NoError(t, err)
     defer resp.Body.Close()
 
     // Verificar respuesta
     assert.Equal(t, http.StatusOK, resp.StatusCode)
     
     if http.StatusOK != resp.StatusCode {  
        t.Fatal("AuthUpdateUser fallo:")
     }

     return result
}
