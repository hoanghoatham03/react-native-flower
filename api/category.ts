import { axiosInstance } from "@/config/axiosConfig";

export interface Category {
    categoryId: string;
    categoryName: string;
}

export async function getCategories() {
    const res = await axiosInstance.get("/categories");
    return res.data;
} 