interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    expiration_date: string;
    image: string | null;
    category_id: number;
  }
  
  interface Category {
    id: number;
    name: string;
  }
  
  export type { Product, Category };
  