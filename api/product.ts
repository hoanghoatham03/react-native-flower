import { axiosInstance } from "@/config/axiosConfig";

export interface Product {
    productId: number;
    productName: string;
    description: string;
    stock: number;
    price: number;
    discount: number;
    realPrice: number;
    categoryId: number;
    imageUrl: string;
}

export interface ProductResponse {
    data: Product[];
    totalPages: number;
    currentPage: number;
}

export const getProducts = async (pageNo: number, pageSize: number) => {
    console.log(`/products?pageNo=${pageNo}&pageSize=${pageSize}`);
    const res = await axiosInstance.get<ProductResponse>(`/products?pageNo=${pageNo}&pageSize=${pageSize}`);
    return res.data;
};

export const getProductByCategoryId = async (categoryId: number, pageNo: number, pageSize: number) => {
    const res = await axiosInstance.get<ProductResponse>(`/products/categories/${categoryId}?pageNo=${pageNo}&pageSize=${pageSize}`);
    return res.data;
};

