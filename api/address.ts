import { axiosInstance } from "@/config/axiosConfig";
import { getToken } from "@/store/authStore";

export interface Address {
    addressId: number;
    street: string;
    district: string;
    city: string;
}

export async function getAllAddress(userId: number) {
    const token = await getToken();
    const res = await axiosInstance.get(`/users/${userId}/addresses`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
}

export async function getAddress(userId: number, addressId: number) {
    const token = await getToken();
    const res = await axiosInstance.get(`/users/${userId}/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
}

export async function createAddress(userId: number, address: Address) {
    const token = await getToken();
    const res = await axiosInstance.post(`/users/${userId}/addresses`, 
        {
            street: address.street,
            district: address.district,
            city: address.city,
        },
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return res.data;
}

export async function updateAddress(userId: number, addressId: number, address: Address) {
    const token = await getToken();
    const res = await axiosInstance.put(`/users/${userId}/addresses/${addressId}`, 
        {
            street: address.street,
            district: address.district,
            city: address.city,
        },
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return res.data;
}

export async function deleteAddress(userId: number, addressId: number) {
    const token = await getToken();
    const res = await axiosInstance.delete(`/users/${userId}/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
}
