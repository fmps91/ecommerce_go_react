package tests_conf

import (
	"os"
	"testing"

	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestEnvVariablesNotEmpty(t *testing.T) {
	// 1. Cargar el archivo .env antes de los tests
	err := godotenv.Load("../.env") // Ajusta la ruta según sea necesario
	require.NoError(t, err, "Error loading .env file")

	// 2. Lista de variables requeridas con sus valores esperados
	requiredVars := map[string]string{
		"DB_HOST":     "localhost",
		"DB_USER":     "postgres",
		"DB_PASSWORD": "postgres",
		"DB_NAME":     "apigo",
		"DB_PORT":     "5432",
		"SERVER_PORT": "5000",
		"SERVER_VERSION": "/api/v1",
		"JWT_SECRET":  "gka66Y/EjT/OCv6UBeW+jWTdfvNtzHFMFjQlSlUnQHQ=",
	}

	for envVar, expectedValue := range requiredVars {
		t.Run(envVar, func(t *testing.T) {
			// Obtener valor actual de la variable
			actualValue := os.Getenv(envVar)
			
			// Verificar que no está vacía
			require.NotEmpty(t, actualValue, "La variable %s no debe estar vacía", envVar)
			
			// Verificar que tiene el valor esperado
			assert.Equal(t, expectedValue, actualValue, "El valor de %s no coincide con el esperado", envVar)
			
			t.Logf("%s=%s (validado)", envVar, actualValue)
		})
	}
}