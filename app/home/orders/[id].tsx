import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { getOrderDetails, deleteOrder } from "@/api/order";
import { Spinner } from "@/components/ui/spinner";
import { useLocalSearchParams, useRouter } from "expo-router";
import { OrderDetails } from "@/api/order";
import { Divider } from "@/components/ui/divider";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";
import { Feather } from "@expo/vector-icons";

const OrderDetailsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuthStore();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    loadOrderDetails();
  }, []);

  const loadOrderDetails = async () => {
    if (!user?.userId || !id) return;
    try {
      setIsLoading(true);
      const response = await getOrderDetails(Number(user.userId), Number(id));
      setOrderDetails(response.data);
    } catch (error) {
      console.error("Error loading order details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!user?.userId || !id) return;
    try {
      setIsLoading(true)
      setIsDeleting(true);
      await deleteOrder(Number(user.userId), Number(id));
      toast.show({
        placement: "top",
        render: () => (
          <Toast action="success">
            <ToastTitle>Success</ToastTitle>
            <ToastDescription>Order deleted successfully</ToastDescription>
          </Toast>
        ),
      });
      router.replace("/home/order");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error">
            <ToastTitle>Error</ToastTitle>
            <ToastDescription>Failed to delete order</ToastDescription>
          </Toast>
        ),
      });
    } finally {
      setIsDeleting(false);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Spinner size="large" color="rgb(156, 63, 70)" />
      </View>
    );
  }

  if (!orderDetails) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>Order not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <VStack space="xl" className="p-4">
        <View className="flex-row justify-between items-center">
          <Text size="2xl" bold>
            Order Details
          </Text>
          <TouchableOpacity 
            onPress={handleDeleteOrder}
            disabled={isDeleting || orderDetails.orderStatus !== "PENDING"}
          >
            <Feather 
              name="trash-2" 
              size={24} 
              color={orderDetails.orderStatus === "PENDING" ? "red" : "gray"} 
            />
          </TouchableOpacity>
        </View>

        <VStack space="md" className="bg-gray-100 p-4 rounded-lg">
          <Text bold>Order #{orderDetails.orderId}</Text>
          <Divider />
          <Text>Status: {orderDetails.orderStatus}</Text>
          <Text>Order Date: {orderDetails.orderDate}</Text>
          <Text>Payment Method: {orderDetails.payment.paymentMethod}</Text>
        </VStack>

        <VStack space="md" className="bg-gray-100 p-4 rounded-lg">
          <Text bold>Delivery Address</Text>
          <Divider />
          <Text>Street: {orderDetails.address.street}</Text>
          <Text>District: {orderDetails.address.district}</Text>
          <Text>City: {orderDetails.address.city}</Text>
        </VStack>

        <VStack space="md" className="bg-gray-100 p-4 rounded-lg">
          <Text bold>Order Items</Text>

          {orderDetails.orderItems.map((item) => (
            <View key={item.orderItemId}>
              <Divider />
              <VStack space="xs" className="flex-row justify-between">
                <Text>{item.product.productName}</Text>
                <Text className="text-gray-600">Quantity: {item.quantity}</Text>
              </VStack>
              <Text>{item.oderPrice.toLocaleString()} đ</Text>
            </View>
          ))}
        </VStack>

        <VStack space="xs" className="bg-gray-100 p-4 rounded-lg">
          <View className="flex-row justify-between">
            <Text>Subtotal</Text>
            <Text>{orderDetails.totalAmount.toLocaleString()} đ</Text>
          </View>
          <View className="flex-row justify-between">
            <Text bold>Total</Text>
            <Text bold>{orderDetails.totalAmount.toLocaleString()} đ</Text>
          </View>
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default OrderDetailsPage;
