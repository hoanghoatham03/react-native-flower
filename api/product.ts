import { axiosInstance } from "@/config/axiosConfig";

export interface ProductDetailResponse {
    data: Product;
}

export interface Product {
    productId: number;
    productName: string;
    description: string;
    stock: number;
    price: number;
    discount: number;
    realPrice: number;
    categoryId: number;
    categoryName?: string;
    comments?: Comment[];
    images?: ProductImage[];
    imageUrl: string;
}

export interface ProductImage {
    imageId: number;
    imageUrl: string;
}

export interface Comment {
   
}

export interface ProductResponse {
    data: Product[];
    totalPages: number;
    currentPage: number;
}

export const getProducts = async (pageNo: number, pageSize: number) => {
    const res = await axiosInstance.get<ProductResponse>(`/products?pageNo=${pageNo}&pageSize=${pageSize}`);
    return res.data;
};

export const getProductByCategoryId = async (categoryId: number, pageNo: number, pageSize: number) => {
    const res = await axiosInstance.get<ProductResponse>(`/products/categories/${categoryId}?pageNo=${pageNo}&pageSize=${pageSize}`);
    return res.data;
};

export const getProductById = async (productId: number) => {
    const res = await axiosInstance.get<ProductDetailResponse>(`/products/${productId}`);
    return res.data;
};

export const getProductByName = async (name: string) => {
    const res = await axiosInstance.get<ProductResponse>(`/products/search?name=${name}`);
    return res.data;
};
