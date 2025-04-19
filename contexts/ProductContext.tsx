import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProductContextType, Product } from '@/types/product';

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // Load products from storage on startup
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsJson = await AsyncStorage.getItem('@products');
        if (productsJson) {
          setProducts(JSON.parse(productsJson));
        }
      } catch (error) {
        console.error('Failed to load products from storage:', error);
      }
    };

    loadProducts();
  }, []);

  // Save products to storage whenever they change
  useEffect(() => {
    const saveProducts = async () => {
      try {
        await AsyncStorage.setItem('@products', JSON.stringify(products));
      } catch (error) {
        console.error('Failed to save products to storage:', error);
      }
    };

    saveProducts();
  }, [products]);

  const addProduct = (newProduct: Omit<Product, 'id' | 'finalPrice'>) => {
    const id = Date.now().toString();
    const finalPrice = calculateFinalPrice(
      newProduct.price,
      newProduct.quantity,
      newProduct.type,
      newProduct.discount
    );

    const product: Product = {
      ...newProduct,
      id,
      finalPrice,
    };

    setProducts(prevProducts => [...prevProducts, product]);
  };

  const removeProduct = (id: string) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
  };

  const clearProducts = () => {
    setProducts([]);
  };

  const getTotal = () => {
    return products.reduce((sum, product) => sum + product.finalPrice, 0);
  };

  const calculateFinalPrice = (
    price: number,
    quantity: number,
    type: 'PP' | 'NP',
    discountPercentage: number
  ) => {
    const totalPrice = price * quantity;
    const discount = type === 'PP' ? (totalPrice * discountPercentage) / 100 : 0;
    return totalPrice - discount;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        removeProduct,
        clearProducts,
        getTotal,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};