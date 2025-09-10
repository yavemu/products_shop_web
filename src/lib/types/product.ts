export interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  stock: number;
  price: number;
  tax: number;
  totalPrice: number;
  mainImage: string;
  thumbnail: string;
}

export interface CartItem extends Product {
  quantity: number;
}
