import { axiosInstance } from "@/config/axiosConfig";
import { Product } from "./product";
import { getToken } from "@/store/authStore";

interface CartResponse {
    data: Cart;
}



export interface CartItem {
    cartItemId: number;
    quantity: number;
    price: number;
    product: Product;
}

export interface Cart {
    cartId: number;
    cartItems: CartItem[];
    totalPrice: number;
}

export const getCart = async (userId: number) => {
    const token = await getToken();
    if (!token) {
        throw new Error("User not authenticated");
    }
    const res = await axiosInstance.get<CartResponse>(`/users/${userId}/carts`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};

export const addToCart = async (userId: number, productId: number, quantity: number) => {
    const token = await getToken();
    if (!token) {
        throw new Error("User not authenticated");
    }
    const res = await axiosInstance.post<Cart>(`/users/${userId}/carts`, {
        productId,
        quantity
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};

export const updateCartItem = async (userId: number, productId: number, quantity: number) => {
    const token = await getToken();
    if (!token) {
        throw new Error("User not authenticated");
    }
    const res = await axiosInstance.put<Cart>(`/users/${userId}/carts`, {
        productId,
        quantity
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};

export const removeFromCart = async (userId: number, productId: number) => {
    const token = await getToken();
    if (!token) {
        throw new Error("User not authenticated");
    }
    const res = await axiosInstance.delete<Cart>(`/users/${userId}/carts/product/${productId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};
