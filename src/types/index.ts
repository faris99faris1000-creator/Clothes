export type ProductCategory =
  | 'new-arrivals'
  | 'menswear'
  | 'womenswear'
  | 'leather'
  | 'shoes'
  | 'accessories'
  | 'sale';

export type ProductGender = 'men' | 'women' | 'unisex';

export type MaterialGroup = 'leather' | 'wool' | 'silk-cashmere' | 'footwear' | 'accessories';

export interface ProductColor {
  name: string;
  nameAr: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  category: ProductCategory;
  secondaryCategories?: ProductCategory[];
  gender: ProductGender;
  materialGroup: MaterialGroup;
  leatherType?: string;
  leatherTypeAr?: string;
  categoryLabel: string;
  categoryLabelAr: string;
  price: number;
  originalPrice?: number;
  image: string;
  secondaryImage?: string;
  tag?: string;
  tagAr?: string;
  description: string;
  descriptionAr: string;
  material: string;
  materialAr: string;
  sizes: string[];
  colors: ProductColor[];
  inStock: boolean;
  featured?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  total: number;
  currency: Currency;
  paymentMethod: 'card' | 'cod';
  status: 'Confirmed' | 'Preparing at Atelier' | 'Shipped';
  customer: OrderCustomer;
}

export type Language = 'en' | 'ar';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'SAR' | 'AED';
