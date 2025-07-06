package tests_conf

import (
    "testing"
	"github.com/fmps92/ecommerce-api/models"
    "github.com/stretchr/testify/assert"
    "gorm.io/gorm"
    //"fmt"
    "golang.org/x/crypto/bcrypt"
)

func TestUserModelFilledCorrectly(t *testing.T) {
    // 1. Preparar datos de prueba
    testUser := models.User{
        Name:     "Test User",
        Email:    "test@example.com",
        Password: "password123",
        IsAdmin:  false,
    }

    // 2. Validar campos básicos
    assert.Equal(t, "Test User", testUser.Name, "Name should match")
    assert.Equal(t, "test@example.com", testUser.Email, "Email should match")
    assert.Equal(t, "password123", testUser.Password, "Password should match")
    assert.False(t, testUser.IsAdmin, "IsAdmin should be false")

    // 3. Validar campos de gorm.Model
    // (Estos se llenan automáticamente al crear el registro)
    assert.Zero(t, testUser.ID, "ID should be zero before creation")
    assert.Zero(t, testUser.CreatedAt, "CreatedAt should be zero before creation")
    assert.Zero(t, testUser.UpdatedAt, "UpdatedAt should be zero before creation")
    assert.Zero(t, testUser.DeletedAt.Time, "DeletedAt should be zero before creation")

    // 4. Validar métodos del modelo
    t.Run("Test HashPassword", func(t *testing.T) {
        originalPassword := testUser.Password
        err := testUser.HashPassword(testUser.Password)
        assert.NoError(t, err, "HashPassword should not return error")
        assert.NotEqual(t, originalPassword, testUser.Password, "Password should be hashed")
        assert.True(t, len(testUser.Password) > 0, "Hashed password should not be empty")

        // Verificar que el hash es válido
        err = bcrypt.CompareHashAndPassword([]byte(testUser.Password), []byte(originalPassword))
        assert.NoError(t, err, "Hashed password should match original")
    })

    t.Run("Test CheckPassword", func(t *testing.T) {
        // Primero hasheamos la contraseña
        err := testUser.HashPassword("password123")
        assert.NoError(t, err)

        // Probamos contraseña correcta
        err = testUser.CheckPassword("password123")
        assert.NoError(t, err, "CheckPassword should succeed with correct password")

        // Probamos contraseña incorrecta
        err = testUser.CheckPassword("wrongpassword")
        assert.Error(t, err, "CheckPassword should fail with incorrect password")
        assert.EqualError(t, err, bcrypt.ErrMismatchedHashAndPassword.Error(), 
            "Should return password mismatch error")
    })
}

func TestUserCRUD(t *testing.T) {
    // Setup
    db := TestDB
    
    // Test Create
    user := models.User{
        Name:     "Test User",
        Email:    "test@example.com",
        Password: "password123",
        IsAdmin: false,
    }
    
	user.HashPassword(user.Password)
    result := db.Create(&user)
    assert.NoError(t, result.Error, "Should create user without error")
    assert.NotZero(t, user.ID, "User ID should be set after creation")
    
    // Test Read
	var foundUser models.User
	foundUser.HashPassword(user.Password)
    result = db.First(&foundUser, user.ID)
    assert.NoError(t, result.Error, "Should find user by ID")
    assert.Equal(t, user.Name, foundUser.Name, "User names should match")
    
    // Test Update
    newName := "Updated Test User"
    result = db.Model(&user).Update("Name", newName)
    assert.NoError(t, result.Error, "Should update user without error")
    
    // Verify update
    result = db.First(&foundUser, user.ID)
    assert.Equal(t, newName, foundUser.Name, "User name should be updated")
    

    // Test Delete
    result = db.Delete(&user)
    assert.NoError(t, result.Error, "Should delete user without error")
    
    // Verify the deleted_at
    result = db.First(&foundUser, user.ID)
    assert.Error(t, result.Error, "Should not find deleted user")
    assert.Equal(t, gorm.ErrRecordNotFound, result.Error, "Error should be record not found")

    
    // Test deleted record
    result = db.Debug().Unscoped().Where("id = ?", user.ID).First(&user)
    assert.NoError(t, result.Error,"Not error in search the user")
    result=db.Unscoped().Delete(&user)
    assert.NoError(t, result.Error,"Not error in delete record")
    
    CloseTestDB()
    //assert.Equal(t, gorm.ErrRecordNotFound, result.Error, "Error should be record not found")
}