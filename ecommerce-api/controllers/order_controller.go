package controllers

import (
    "log"
    "fmt"
    "time"
    "strconv"
    "net/http"
    "github.com/fmps92/ecommerce-api/models"
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

type OrderController struct {
    DB *gorm.DB
}

func NewOrderController(db *gorm.DB) *OrderController {
    return &OrderController{DB: db}
}

type CreateOrderInput struct {
    Products []struct {
        ProductID uint `json:"product_id" binding:"required"`
        Quantity  int  `json:"quantity" binding:"required,min=1"`
    } `json:"products" binding:"required"`
}

type UpdateOrderInput struct {
    Status string `json:"status"`
}

func (oc *OrderController) CreateOrder(c *gin.Context) {
    userID, _ := c.Get("userID")
    var input CreateOrderInput


    log.Printf("Iniciando creación de orden para usuario ID")
    fmt.Printf("Datos de entrada recibidos:")
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, models.Response{
            Status: http.StatusBadRequest,
            Error:  "Validation error",
            Detail: err.Error(),
        })
        return
    }

    // Start transaction
    tx := oc.DB.Begin()
    defer func() {
        if r := recover(); r != nil {
            tx.Rollback()
        }
    }()

    // Create order
    order := models.Order{
        UserID: userID.(uint),
        Status: "pending",
        Total:  0,
    }

    if err := tx.Create(&order).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: http.StatusInternalServerError,
            Error:  "Could not create order",
            Detail: "function CreateOrder",
        })
        return
    }

    var total float64 = 0
    var orderDetails []models.OrderDetail

    // Process each product in the order
    for _, item := range input.Products {
        var product models.Product
        if err := tx.First(&product, item.ProductID).Error; err != nil {
            tx.Rollback()
            c.JSON(http.StatusNotFound, models.Response{
                Status: http.StatusNotFound,
                Error:  "Product not found",
                Detail: err.Error(),
            })
            return
        }

        if product.Stock < item.Quantity {
            tx.Rollback()
            c.JSON(http.StatusBadRequest, models.Response{
                Status: http.StatusBadRequest,
                Error:  "Insufficient stock",
                Detail: "Product ID: " + string(item.ProductID),
            })
            return
        }

        // Update product stock
        product.Stock -= item.Quantity
        if err := tx.Save(&product).Error; err != nil {
            tx.Rollback()
            c.JSON(http.StatusInternalServerError, models.Response{
                Status: http.StatusInternalServerError,
                Error:  "Could not update product stock",
                Detail: "function CreateOrder",
            })
            return
        }

        // Create order detail
        orderDetail := models.OrderDetail{
            OrderID:   order.ID,
            ProductID: item.ProductID,
            Quantity:  item.Quantity,
            Price:     product.Price,
        }

        if err := tx.Create(&orderDetail).Error; err != nil {
            tx.Rollback()
            c.JSON(http.StatusInternalServerError, models.Response{
                Status: http.StatusInternalServerError,
                Error:  "Could not create order detail",
                Detail: "function CreateOrder",
            })
            return
        }

        orderDetails = append(orderDetails, orderDetail)
        total += product.Price * float64(item.Quantity)
    }

    // Update order total
    order.Total = total
    if err := tx.Save(&order).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: http.StatusInternalServerError,
            Error:  "Could not update order total",
            Detail: "function CreateOrder",
        })
        return
    }

    // Commit transaction
    tx.Commit()

    // Load order details with products
    if err := oc.DB.Preload("OrderDetails.Product").First(&order, order.ID).Error; err != nil {
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: http.StatusInternalServerError,
            Error:  "Could not fetch order details",
            Detail: "function CreateOrder",
        })
        return
    }

    c.JSON(http.StatusCreated, models.Response{
        Status: http.StatusCreated,
        Data:   order,
        Detail: "function CreateOrder",
    })
}

func (oc *OrderController) GetOrders(c *gin.Context) {
    var pagination Pagination
    if err := c.ShouldBindQuery(&pagination); err != nil {
        c.JSON(http.StatusBadRequest, models.Response{
            Status: http.StatusBadRequest,
            Error:  "Invalid pagination parameters",
            Detail: "function GetOrders",
        })
        return
    }

    userID, _ := c.Get("userID")
    isAdmin, _ := c.Get("isAdmin")

    var orders []models.Order
    db, resp := pagination.Paginate(oc.DB, &orders)
    if resp != nil {
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: resp.Status,
            Error: "error in the pagination",
            Detail: "function GetOrders",

        })
        return
    }

    // If not admin, only show user's orders
    if !isAdmin.(bool) {
        db = db.Where("user_id = ?", userID)
    }

    if err := db.Preload("OrderDetails.Product").Find(&orders).Error; err != nil {
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: http.StatusInternalServerError,
            Error:  "Could not fetch orders",
            Detail: "function GetOrders",
            
        })
        return
    }

    c.JSON(http.StatusOK, models.Response{
        Status: http.StatusOK,
        Data:   orders,
        Detail: "function GetOrders",
    })
}

func (oc *OrderController) GetOrder(c *gin.Context) {
    id := c.Param("id")
    userID, _ := c.Get("userID")
    isAdmin, _ := c.Get("isAdmin")

    var order models.Order
    query := oc.DB.Preload("OrderDetails.Product").First(&order, id)
    
    if query.Error != nil {
        c.JSON(http.StatusNotFound, models.Response{
            Status: http.StatusNotFound,
            Error:  "Order not found",
        })
        return
    }

    // If not admin, check if order belongs to user
    if !isAdmin.(bool) && order.UserID != userID.(uint) {
        c.JSON(http.StatusForbidden, models.Response{
            Status: http.StatusForbidden,
            Error:  "You are not authorized to view this order",
        })
        return
    }

    c.JSON(http.StatusOK, models.Response{
        Status: http.StatusOK,
        Data:   order,
        Detail: "function GetOrder",
    })
}

func (oc *OrderController) UpdateOrder(c *gin.Context) {
    id := c.Param("id")
    var input UpdateOrderInput

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, models.Response{
            Status: http.StatusBadRequest,
            Error:  "Validation error",
            Detail: err.Error(),
        })
        return
    }

    var order models.Order
    if err := oc.DB.First(&order, id).Error; err != nil {
        c.JSON(http.StatusNotFound, models.Response{
            Status: http.StatusNotFound,
            Error:  "Order not found",
            Detail: "function UpdateOrder",
        })
        return
    }

    if err := oc.DB.Model(&order).Update("status", input.Status).Error; err != nil {
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: http.StatusInternalServerError,
            Error:  "Could not update order",
            Detail: "function UpdateOrder",
        })
        return
    }

    c.JSON(http.StatusOK, models.Response{
        Status: http.StatusOK,
        Data:   order,
        Detail: "function UpdateOrder",
    })
}

func (oc *OrderController) DeleteOrderDeleted_at(c *gin.Context) {
    id := c.Param("id")
    log.Printf("Iniciando eliminación lógica de orden ID: %s", id)

    // Validar ID
    if id == "" {
        c.JSON(http.StatusBadRequest, models.Response{
            Status: http.StatusBadRequest,
            Error:  "ID de orden no proporcionado",
        })
        return
    }

    // Convertir ID
    orderID, err := strconv.ParseUint(id, 10, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, models.Response{
            Status: http.StatusBadRequest,
            Error:  "ID de orden inválido",
            Detail: "El ID debe ser un número válido",
        })
        return
    }

    // Iniciar transacción
    tx := oc.DB.Begin()
    defer func() {
        if r := recover(); r != nil {
            tx.Rollback()
            log.Printf("Panic recuperado: %v", r)
        }
    }()

    // 1. Eliminación lógica de los OrderDetails asociados
    if err := tx.Model(&models.OrderDetail{}).
        Where("order_id = ?", orderID).
        Update("deleted_at", time.Now()).Error; err != nil {
        
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: http.StatusInternalServerError,
            Error:  "Error al marcar detalles como eliminados",
            Detail: err.Error(),
        })
        return
    }

    // 2. Eliminación lógica de la Order principal
    if err := tx.Delete(&models.Order{}, orderID).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: http.StatusInternalServerError,
            Error:  "Error al eliminar la orden",
            Detail: err.Error(),
        })
        return
    }

    // Confirmar transacción
    if err := tx.Commit().Error; err != nil {
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: http.StatusInternalServerError,
            Error:  "Error al confirmar la eliminación",
        })
        return
    }

    log.Printf("Orden y detalles marcados como eliminados. ID: %d", orderID)
    c.JSON(http.StatusOK, models.Response{
        Status: http.StatusOK,
        Data:   "Orden y detalles marcados como eliminados",
        Detail: "function DeleteOrderDeleted_at",
    })
}


func (oc *OrderController) DeleteOrderDatabase(c *gin.Context) {
    // Obtener el ID de la orden
    id := c.Param("id")
    log.Printf("Iniciando eliminación en cascada de orden con ID: %s", id)

    // Validar ID
    if id == "" {
        c.JSON(http.StatusBadRequest, models.Response{
            Status: http.StatusBadRequest,
            Error:  "ID de orden no proporcionado",
        })
        return
    }

    // Convertir ID
    orderID, err := strconv.ParseUint(id, 10, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, models.Response{
            Status: http.StatusBadRequest,
            Error:  "ID inválido",
            Detail: "El ID debe ser un número",
        })
        return
    }

    // Iniciar transacción
    tx := oc.DB.Begin()
    defer func() {
        if r := recover(); r != nil {
            tx.Rollback()
            log.Printf("Recovered from panic: %v", r)
        }
    }()

    // Verificar existencia de la orden (incluyendo eliminados lógicos)
    var order models.Order
    if err := tx.Unscoped().Preload("OrderDetails").First(&order, orderID).Error; err != nil {
        tx.Rollback()
        if err == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, models.Response{
                Status: http.StatusNotFound,
                Error:  "Orden no encontrada",
            })
        } else {
            c.JSON(http.StatusInternalServerError, models.Response{
                Status: http.StatusInternalServerError,
                Error:  "Error al buscar la orden",
            })
        }
        return
    }

    // Eliminación en cascada manual (física)
    if len(order.OrderDetails) > 0 {
        if err := tx.Unscoped().Where("order_id = ?", orderID).Delete(&models.OrderDetail{}).Error; err != nil {
            tx.Rollback()
            c.JSON(http.StatusInternalServerError, models.Response{
                Status: http.StatusInternalServerError,
                Error:  "Error al eliminar detalles de la orden",
            })
            return
        }
    }

    // Eliminar la orden principal (física)
    if err := tx.Unscoped().Delete(&order).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: http.StatusInternalServerError,
            Error:  "Error al eliminar la orden",
        })
        return
    }

    // Commit
    if err := tx.Commit().Error; err != nil {
        c.JSON(http.StatusInternalServerError, models.Response{
            Status: http.StatusInternalServerError,
            Error:  "Error al confirmar la transacción",
        })
        return
    }

    c.JSON(http.StatusOK, models.Response{
        Status: http.StatusOK,
        Data:   "Orden y detalles eliminados permanentemente",
        Detail: "function DeleteOrderDatabase",

    })
}