// src/contexts/CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

import { Button, Divider, notification, Space } from 'antd';
import { toast } from 'react-toastify';


// 1. Crear el contexto
const CartContext = createContext();

// 2. Crear el provider
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const [api, contextHolder] = notification.useNotification();
  const openNotification = placement => {
    api.info({
      message: `Notification ${placement}`,
      description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      placement,
    });
  };

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // En CartContext.jsx
  const addToCart = (product, valor = "1") => {
    // Validar que el valor sea un número positivo
    let quantityToAdd = 1;
    try {
      quantityToAdd = parseInt(valor) || 1;
    } catch (error) {
      console.log("error: ", error);
      quantityToAdd = 1;
    }
  
    // Verificar stock primero (antes de setCartItems)
    if (quantityToAdd > product.stock) {
      setTimeout(() => toast.error("No hay suficiente stock disponible"));
      return;
    }
  
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.ID === product.ID);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantityToAdd;
        
        // Verificación de stock dentro del setter
        if (newQuantity > product.stock) {
          setTimeout(() => toast.error("No puedes agregar más unidades de las disponibles"));
          return prevItems;
        }
        
        return prevItems.map(item =>
          item.ID === product.ID
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      
      return [...prevItems, { 
        ...product, 
        quantity: quantityToAdd 
      }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 3. Crear el hook personalizado
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// 4. Exportar el contexto directamente (opcional)
export default CartContext;