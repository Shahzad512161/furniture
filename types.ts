
export enum Category {
  SOFAS = 'Sofas',
  SOFA_BEDS = 'Sofa Beds',
  BEDS = 'Beds',
  BED_SHEETS = 'Bed Sheets',
  CHAIRS = 'Chairs',
  TABLES = 'Tables',
  HOME_FURNITURE = 'Home Furniture'
}

export enum SeaterType {
  ONE = '1 Seater',
  TWO = '2 Seater',
  THREE = '3 Seater',
  FIVE = '5 Seater',
  N_A = 'N/A'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  seaterType: SeaterType;
  imageUrl: string;
  featured?: boolean;
  createdAt: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  role: 'admin' | 'customer';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  customerDetails: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: number;
}
