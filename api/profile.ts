import { axiosInstance } from "@/config/axiosConfig";
import { getToken } from "@/store/authStore";
import { Address } from "@/api/address";

interface Profile {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    avatar: string;
}

export async function getProfile(userId: number) {
    const token = await getToken();
    const res = await axiosInstance.get(`/users/${userId}/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

// firstName
// string
// firstName
// Send empty value
// lastName
// string
// lastName
// Send empty value
// mobileNumber
// string
// mobileNumber
// Send empty value
// avatar
// string($binary) 

//use multipart/form-data

export async function updateProfile(userId: number, formData: FormData) {
    const token = await getToken();
    const res = await axiosInstance.put(`/users/${userId}/profile`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
        }
    });
    return res.data;
}