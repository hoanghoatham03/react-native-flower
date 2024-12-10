import { axiosInstance } from "@/config/axiosConfig";
import { getToken } from "@/store/authStore";
import { Address } from "./address";
import { Product } from "./product";

interface OrderItem {
    orderItemId: number;
    quantity: number;
    oderPrice: number;
    order: string;
    product: Product;
}

interface Payment {
    paymentId: number;
    paymentMethod: string;
}

export interface Order {
    orderId: number;
    orderDate: string;
    totalAmount: number;
    orderStatus: string;
    address: Address;
    payment: Payment;
    orderItems: OrderItem[];
    paymentStatus: string;
}

export interface OrderDetails {
    orderId: number;
    orderDate: string;
    totalAmount: number;
    orderStatus: string;
    address: Address;
    payment: Payment;
    orderItems: OrderItem[];
    paymentStatus: string;
}

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

//data response
// [{"orderId": 0,
//     "orderDate": "2024-12-09T18:07:47.591Z",
//     "totalAmount": 0,
//     "orderStatus": "PENDING",
//     "address": {
//       "addressId": 0,
//       "street": "string",
//       "district": "string",
//       "city": "string"
//     },
//     "payment": {
//       "paymentId": 0,
//       "paymentMethod": "CASH"
//     },
//     "orderItems": [
//       {
//         "orderItemId": 0,
//         "quantity": 0,
//         "oderPrice": 0,
//         "order": "string",
//         "product": {
//           "productId": 0,
//           "productName": "string",
//           "description": "string",
//           "stock": 0,
//           "price": 0,
//           "discount": 0,
//           "realPrice": 0,
//           "images": [
//             {
//               "imageId": 0,
//               "imageUrl": "string"
//             }
//           ]
//         }
//       }
//     ],
//     "paymentStatus": "PENDING"}]
export async function getOrder(userId: number) {
    const token = await getToken();
    const res = await axiosInstance.get(`/users/${userId}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
}

export async function getOrderDetails(userId: number, orderId: number) {
    const token = await getToken();
    const res = await axiosInstance.get(`/users/${userId}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
}

export async function deleteOrder(userId: number, orderId: number) {
    const token = await getToken();
    const res = await axiosInstance.delete(`/orders/${orderId}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
}
