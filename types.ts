
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  whatsapp: string;
  notes: string;
  deliveryDate: string;
}

export interface Order {
  items: CartItem[];
  customer: CustomerDetails;
  total: number;
}
