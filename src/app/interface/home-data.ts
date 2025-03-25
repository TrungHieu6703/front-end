export interface Product {
    id: string;
    name: string;
    price: number;
    coupon: number;
    specs_summary: string;
  }
  
  export interface VisibleProducts {
    [key: string]: Product;
  }
  
  export interface HomeData {
    laptop: Product[];
    visible: VisibleProducts;
    phu_kien: Product[];
    hot_products: Product[];
  }
  