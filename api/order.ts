import { axiosInstance } from "@/config/axiosConfig";
import { getToken } from "@/store/authStore";

// {
//     "userId": 0,
//     "addressId": 0,
//     "paymentId": 0
//   }

export async function createOrder(userId: number, addressId: number, paymentId: number) {
    const token = await getToken();
    const res = await axiosInstance.post(`/users/orders`, {
        userId,
        addressId,
        paymentId
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}