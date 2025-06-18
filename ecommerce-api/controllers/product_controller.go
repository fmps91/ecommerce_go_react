package controllers

import (
    "io"    // Para io.ReadAll
    "fmt"
    "strings"
    "math"                  
	"net/http"
	"strconv"
    "github.com/fmps92/ecommerce-api/models"
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

type ProductController struct {
    DB *gorm.DB
}

func NewProductController(db *gorm.DB) *ProductController {
    return &ProductController{DB: db}
}

func (pc *ProductController) CreateProduct(c *gin.Context) {
    // Parsear el formulario multipart
    if err := c.Request.ParseMultipartForm(32 << 20); err != nil { // 32MB max
        c.JSON(http.StatusBadRequest, models.Response{
            Status: http.StatusBadRequest,
            Error:  "Error al procesar el formulario",
            Detail: "function CreateProduct",
        })
        return
    }

    // Obtener datos básicos
    name := c.PostForm("name")
    description := c.PostForm("description")
    category := c.PostForm("category")
    price, err := strconv.ParseFloat(c.PostForm("price"), 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, models.Response{
            Status: http.StatusBadRequest,
            Error:  "Precio inválido",
            Detail: "function CreateProduct",
        })
        return
    }
    
    stock, err := strconv.Atoi(c.PostForm("stock"))
    if err != nil {
        c.JSON(http.StatusBadRequest, models.Response{
            Status: http.StatusBadRequest,
            Error:  "Stock inválido",
            Detail: "function CreateProduct",
        })
        return
    }

    // Crear el producto
    product := models.Product{
        Name:        name,
        Description: description,
        Category:    category,
        Price:       price,
        Stock:       stock,
    }

    // Procesar imágenes
    files := c.Request.MultipartForm.File["images"]
    for i, fileHeader := range files {
        file, err := fileHeader.Open()
        if err != nil {
            continue
        }
        
        imageBytes, err := io.ReadAll(file)
        file.Close()
        if err != nil {
            continue
        }

        image := models.Image{
            Data:        imageBytes,
            ContentType: fileHeader.Header.Get("Content-Type"),
            IsPrimary:   i == 0,
        }

        product.Images = append(product.Images, image)
    }

    // Guardar en la base de datos con transacción
    err = pc.DB.Transaction(func(tx *gorm.DB) error {
        if err := tx.Create(&product).Error; err != nil {
            return err
        }
        return nil
    })

    if err != nil {
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: http.StatusInternalServerError,
            Error:  "Error al crear producto: " + err.Error(),
            Detail: "function CreateProduct",
        })
        return
    }

    c.JSON(http.StatusCreated, models.Response{
        Status: http.StatusCreated,
        Data:   product,
        Detail: "function CreateProduct",
    })
}

func (pc *ProductController) GetProducts(c *gin.Context) {
	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil || page < 1 {
		page = 1
	}

	pageSize, err := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	if err != nil || pageSize < 1 {
		pageSize = 10
	}

	var products []models.Product
	var total int64

	// Contar el total de productos
	pc.DB.Model(&models.Product{}).Count(&total)

	// Calcular offset
	offset := (page - 1) * pageSize

	// Obtener productos con paginación
	result := pc.DB.Preload("Images").Offset(offset).Limit(pageSize).Find(&products)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, models.Response{
			Data:   nil,
			Status: http.StatusInternalServerError,
			Error:  result.Error.Error(),
			Detail: "get products with pagination function GetProducts",
		})
		return
	}

	responseData := gin.H{
		"products": products,
		"page":     page,
		"pageSize": pageSize,
		"total":    total,
	}

	c.JSON(http.StatusOK, models.Response{
		Data:   responseData,
		Status: http.StatusOK,
		Detail: "function GetProducts",
	})
}


func (pc *ProductController) GetProductsParams(c *gin.Context) {
    // 1. Inicialización y parámetros
    page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
    if page < 1 { page = 1 }

    pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
    if pageSize < 1 || pageSize > 100 { pageSize = 10 }

    // 2. Obtener parámetros
    params := struct {
        Search   string
        SortBy   string
        Order    string
        Category string
        Stock    string
    }{
        Search:   strings.TrimSpace(c.Query("search")),
        SortBy:   c.DefaultQuery("sort_by", "created_at"),
        Order:    strings.ToLower(c.DefaultQuery("order", "desc")),
        Category: strings.TrimSpace(c.Query("category")),
        Stock:    strings.TrimSpace(c.DefaultQuery("stock", "0")),
    }

    // 3. Configurar consulta base
    dbQuery := pc.DB.Model(&models.Product{})

    // 4. Aplicar filtros
    if params.Search != "" {
        search := "%" + params.Search + "%"
        dbQuery = dbQuery.Where(
            "name LIKE ? OR description LIKE ?", 
            search, 
            search,
        )
    }

    if params.Category != "" {
        dbQuery = dbQuery.Where("category = ?", params.Category)
    }

    // 5. Filtro de stock mejorado
    if params.Stock != "" && params.Stock != "0" {
        switch params.Stock {
        case "in_stock":
            dbQuery = dbQuery.Where("stock > 0")
        case "out_of_stock":
            dbQuery = dbQuery.Where("stock = 0")
        default:
            if stockVal, err := strconv.Atoi(params.Stock); err == nil {
                dbQuery = dbQuery.Where("stock > ?", stockVal)
            }
        }
    }

    // 6. Ordenación segura
    validSortFields := map[string]bool{
        "name": true, "price": true, "created_at": true, 
        "updated_at": true, "stock": true,
    }

    if !validSortFields[params.SortBy] {
        params.SortBy = "created_at"
    }

    if params.Order != "asc" && params.Order != "desc" {
        params.Order = "desc"
    }

    dbQuery = dbQuery.Order(fmt.Sprintf("%s %s", params.SortBy, params.Order))

    // 7. Paginación
    var total int64
    if err := dbQuery.Count(&total).Error; err != nil {
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: http.StatusInternalServerError,
            Error:  err.Error(),
            Detail: "function GetProductsParams",
        })
        return
    }

    offset := (page - 1) * pageSize
    // Calcular total de páginas
    totalPages := int(math.Ceil(float64(total) / float64(pageSize)))
    var products []models.Product

    // 8. Ejecutar consulta (sin Preload primero para probar)
    if err := dbQuery.Preload("Images").Offset(offset).Limit(pageSize).Find(&products).Error; err != nil {
        c.JSON(http.StatusInternalServerError,models.Response{
                Status: http.StatusInternalServerError,
                Error:  err.Error(),
                Detail: "function GetProductsParams",
            })
        return
    }

    //9. Respuesta

    responseData := gin.H{
        "products":   products,
        "pagination": gin.H{
            "current_page": page,
            "page_size":    pageSize,
            "total_items":  total,
            "total_pages":  totalPages,
        },
        "sort": gin.H{
            "by":    params.SortBy,
            "order": params.Order,
        },
        "filters": gin.H{
            "search":   params.Search,
            "category": params.Category,
            "stock":    params.Stock,
        },
    }

    c.JSON(http.StatusOK, models.Response{
        Data:   responseData,
        Status: http.StatusOK,
        Detail: "function GetProductsParams",
    })
}

func (pc *ProductController) GetProduct(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{
			Data:   nil,
			Status: http.StatusBadRequest,
			Error:  "ID de producto inválido",
			Detail: "function GetProduct",
		})
		return
	}

	var product models.Product
	result := pc.DB.Preload("Images").First(&product, id)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, models.Response{
				Data:   nil,
				Status: http.StatusNotFound,
				Error:  "Producto no encontrado",
				Detail: "function GetProduct",
			})
		} else {
			c.JSON(http.StatusInternalServerError, models.Response{
				Data:   nil,
				Status: http.StatusInternalServerError,
				Error:  result.Error.Error(),
				Detail: "function GetProduct",
			})
		}
		return
	}

	c.JSON(http.StatusOK, models.Response{
		Data:   product,
		Status: http.StatusOK,
		Detail: "function GetProduct",
	})
}

// UpdateProduct actualiza un producto existente
func (pc *ProductController) UpdateProduct(c *gin.Context) {
    // Obtener ID del producto
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, models.Response{
            Data:   nil,
            Status: http.StatusBadRequest,
            Error:  "ID de producto inválido",
            Detail: "function UpdateProduct",
        })
        return
    }

    // Parsear form-data
    name := c.PostForm("name")
    description := c.PostForm("description")
    category := c.PostForm("category")
    priceStr := c.PostForm("price")
    stockStr := c.PostForm("stock")

    // Convertir valores numéricos
    price, err := strconv.ParseFloat(priceStr, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, models.Response{
            Data:   nil,
            Status: http.StatusBadRequest,
            Error:  "Formato de precio inválido",
            Detail: "function UpdateProduct",
        })
        return
    }

    stock, err := strconv.Atoi(stockStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, models.Response{
            Data:   nil,
            Status: http.StatusBadRequest,
            Error:  "Formato de stock inválido",
            Detail: "function UpdateProduct",
        })
        return
    }

    // Iniciar transacción
    err = pc.DB.Transaction(func(tx *gorm.DB) error {
        // Buscar producto existente
        var product models.Product
        if err := tx.First(&product, id).Error; err != nil {
            return err
        }

        // Actualizar campos del producto
        product.Name = name
        product.Description = description
        product.Category = category
        product.Price = price
        product.Stock = stock

        // Guardar cambios del producto
        if err := tx.Save(&product).Error; err != nil {
            return err
        }

        // Eliminar imágenes antiguas (hard delete)
        if err := tx.Unscoped().Where("product_id = ?", id).Delete(&models.Image{}).Error; err != nil {
            return err
        }

        // Procesar nuevas imágenes
        form, err := c.MultipartForm()
        if err != nil {
            return err
        }

        files := form.File["images"]
        for _, fileHeader := range files {
            file, err := fileHeader.Open()
            if err != nil {
                return err
            }

            imageData, err := io.ReadAll(file)
            if err != nil {
                file.Close()
                return err
            }
            file.Close()

            contentType := fileHeader.Header.Get("Content-Type")
            if contentType == "" {
                contentType = http.DetectContentType(imageData)
            }

            newImage := models.Image{
                ProductID:   product.ID,
                Data:        imageData,
                ContentType: contentType,
                IsPrimary:   false, // Puedes implementar lógica para marcar una como principal
            }

            if err := tx.Create(&newImage).Error; err != nil {
                return err
            }
        }

        return nil
    })

    if err != nil {
        if err == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, models.Response{
                Data:   nil,
                Status: http.StatusNotFound,
                Error:  "Producto no encontrado",
                Detail: "function UpdateProduct",
            })
        } else {
            c.JSON(http.StatusInternalServerError, models.Response{
                Data:   nil,
                Status: http.StatusInternalServerError,
                Error:  "Error al actualizar: " + err.Error(),
                Detail: "function UpdateProduct",
            })
        }
        return
    }

    // Obtener producto actualizado con sus imágenes
    var updatedProduct models.Product
    if err := pc.DB.Preload("Images").First(&updatedProduct, id).Error; err != nil {
        c.JSON(http.StatusInternalServerError, models.Response{
            Data:   nil,
            Status: http.StatusInternalServerError,
            Error:  "Error al obtener producto actualizado",
            Detail: "function UpdateProduct",
        })
        return
    }

    //para que no se haga lenta la consulta del update solo voy a enviar los datos de product sin imagenes
    updatedProduct.Images = nil
    c.JSON(http.StatusOK, models.Response{
        Data:   updatedProduct,
        Status: http.StatusOK,
        Detail: "function UpdateProduct",
    })
}

// DeleteProduct elimina un producto
func (pc *ProductController) DeleteProductDeleted_at(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{
			Data:   nil,
			Status: http.StatusBadRequest,
			Error:  "ID de producto inválido",
			Detail: "function DeleteProductDeleted_at",
		})
		return
	}

	// Iniciar una transacción para asegurar la integridad de los datos
	err = pc.DB.Transaction(func(tx *gorm.DB) error {
		// Primero eliminar todas las imágenes asociadas al producto
		if err := tx.Where("product_id = ?", id).Delete(&models.Image{}).Error; err != nil {
			return err
		}

		// Luego eliminar el producto (soft delete)
		result := tx.Delete(&models.Product{}, id)
		if result.Error != nil {
			return result.Error
		}

		if result.RowsAffected == 0 {
			return gorm.ErrRecordNotFound
		}

		return nil
	})

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, models.Response{
				Data:   nil,
				Status: http.StatusNotFound,
				Error:  "Producto no encontrado",
				Detail: "function DeleteProductDeleted_at",
			})
		} else {
			c.JSON(http.StatusInternalServerError, models.Response{
				Data:   nil,
				Status: http.StatusInternalServerError,
				Error:  err.Error(),
				Detail: "function DeleteProductDeleted_at",
			})
		}
		return
	}

	c.JSON(http.StatusOK, models.Response{
		Data:   gin.H{"message": "Producto e imágenes asociadas eliminadas correctamente"},
		Status: http.StatusOK,
		Detail: "function DeleteProductDeleted_at",
	})
}

func (pc *ProductController) DeleteProductDatabase(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, models.Response{
            Data:   nil,
            Status: http.StatusBadRequest,
            Error:  "ID de producto inválido",
            Detail: "function DeleteProductDatabase",
        })
        return
    }

    // Iniciar una transacción para asegurar la integridad de los datos
    err = pc.DB.Transaction(func(tx *gorm.DB) error {
        // Primero eliminar físicamente todas las imágenes asociadas al producto
        if err := tx.Unscoped().Where("product_id = ?", id).Delete(&models.Image{}).Error; err != nil {
            return err
        }

        // Luego eliminar físicamente el producto
        result := tx.Unscoped().Delete(&models.Product{}, id)
        if result.Error != nil {
            return result.Error
        }

        if result.RowsAffected == 0 {
            return gorm.ErrRecordNotFound
        }

        return nil
    })

    if err != nil {
        if err == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, models.Response{
                Data:   nil,
                Status: http.StatusNotFound,
                Error:  "Producto no encontrado",
                Detail: "function DeleteProductDatabase",
            })
        } else {
            c.JSON(http.StatusInternalServerError, models.Response{
                Data:   nil,
                Status: http.StatusInternalServerError,
                Error:  err.Error(),
                Detail: "function DeleteProductDatabase",
            })
        }
        return
    }

    c.JSON(http.StatusOK, models.Response{
        Data:   gin.H{"message": "Producto e imágenes asociadas eliminadas permanentemente de la base de datos"},
        Status: http.StatusOK,
        Detail: "function DeleteProductDatabase",
    })
}
