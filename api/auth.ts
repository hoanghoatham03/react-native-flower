const API_URL = process.env.EXPO_PUBLIC_FLOWERSTORE_OPENAPI_DEV_URL;
import { axiosInstance } from "@/config/axiosConfig";

export async function login(email: string, password: string) {
  const res = await axiosInstance.post("/auth/login", { email, password });
  return res.data;
}

export async function register(
  firstName: string,
  lastName: string,
  mobileNumber: string,
  email: string,
  password: string
) {
  const res = await axiosInstance.post("/auth/register", {
    firstName,
    lastName,
    mobileNumber,
    email,
    password,
  });
  return res.data;
}

export async function logout() {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
}

