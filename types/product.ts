export interface Product {
  id: string;
  code: string;
  description: string;
  price: number;
  quantity: number;
  type: 'PP' | 'NP';
  discount: number;
  finalPrice: number;
}

export interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'finalPrice'>) => void;
  removeProduct: (id: string) => void;
  clearProducts: () => void;
  getTotal: () => number;
}