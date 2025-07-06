package tests_controllers


import (
	"bytes"
	"encoding/json"
	"io"
    "mime/multipart"
    "net/textproto"
	"net/http"
	"os"
	"path/filepath"
	"testing"
	"github.com/stretchr/testify/assert"
    "fmt"
	//"net/http/httptest"

	//"github.com/gin-gonic/gin"
    //"strings"
    //"log"
    //"github.com/fmps92/ecommerce-api/routes"
	//"github.com/fmps92/ecommerce-api/controllers"
	//"github.com/fmps92/ecommerce-api/models"
	//"github.com/fmps92/ecommerce-api/utils"
	//"github.com/fmps92/ecommerce-api/config"
    //"github.com/joho/godotenv"


)


func ProductCreateProduct(t *testing.T, token string, url string) (map[string]interface{}) {

    body := &bytes.Buffer{}
    writer := multipart.NewWriter(body)
    
    // Añadir campos del formulario
    productData := map[string]string{
        "name":        "Smartphone Premium",
        "description": "Último modelo con cámara de 108MP",
        "category":    "Electrónicos",
        "price":       "899.99",
        "stock":       "25",
    }
    
    for key, value := range productData {
        err := writer.WriteField(key, value)
        assert.NoError(t, err, "Error al escribir campo "+key)
    }
    
    //Añadir imágenes de prueba con Content-Type explícito
    imageFiles := []struct {
		fieldName   string
		filePath    string
		contentType string
		isPrimary   bool
	}{
		{"images", "image/image1.jpeg", "image/jpeg", true},
		{"images", "image/image2.jpeg", "image/jpeg", false},
	}

	for _, img := range imageFiles {
		file, err := os.Open(img.filePath)
		if !assert.NoError(t, err, "Error al abrir archivo de imagen") {
			continue
		}
		defer file.Close()

		// Crear la parte del formulario con headers personalizados
		h := make(textproto.MIMEHeader)
		h.Set("Content-Disposition",
			fmt.Sprintf(`form-data; name="%s"; filename="%s"`,
				img.fieldName, filepath.Base(img.filePath)))
		h.Set("Content-Type", img.contentType) // Establecer Content-Type explícitamente

		part, err := writer.CreatePart(h)
		assert.NoError(t, err, "Error al crear parte del formulario con headers")

		_, err = io.Copy(part, file)
		assert.NoError(t, err, "Error al copiar datos de imagen")
	}
    
    // Cerrar el writer para finalizar el cuerpo
    err := writer.Close()
    assert.NoError(t, err, "Error al cerrar el writer multipart")
    
    // Crear la petición HTTP POST
    req, err := http.NewRequest(
        http.MethodPost,
        url+"/products",
        body,
    )
    assert.NoError(t, err, "Error al crear la petición HTTP")
    
    // Configurar headers
    req.Header.Set("Content-Type", writer.FormDataContentType())
    req.Header.Set("Authorization", "Bearer "+token)

    // Ejecutar petición
    client := http.Client{}
    resp, err := client.Do(req)
    assert.NoError(t, err, "Error al ejecutar la petición")
    defer resp.Body.Close()

    // Leer y procesar la respuesta
    bodyBytes, err := io.ReadAll(resp.Body)
    assert.NoError(t, err, "Error al leer la respuesta")

    var result map[string]interface{}
    err = json.Unmarshal(bodyBytes, &result)
    assert.NoError(t, err, "Error al decodificar la respuesta JSON")

    // Verificar respuesta
    assert.Equal(t, http.StatusCreated, resp.StatusCode, "Código de estado inesperado")
    if resp.StatusCode != http.StatusCreated {
        t.Fatalf("ProductCreateProduct falló. Código: %d, Respuesta: %s", resp.StatusCode, string(bodyBytes))
    }

    // Obtener y retornar el campo "data"
    dataField, ok := result["data"].(map[string]interface{})
    assert.True(t, ok, "El campo 'data' no es un mapa válido")
    
    return dataField
}


/* func AuthLoginUser(t *testing.T,url string) (string){

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
} */
