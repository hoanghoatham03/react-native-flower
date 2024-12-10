import { View, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { getOrderDetails } from "@/api/order";
import { Spinner } from "@/components/ui/spinner";
import { useLocalSearchParams } from "expo-router";
import { OrderDetails } from "@/api/order";
import { Divider } from "@/components/ui/divider";

const OrderDetailsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const { id } = useLocalSearchParams<{ id: string }>();

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

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Spinner size="large" color="rgb(235, 75, 149)" />
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
        <Text size="2xl" bold>Order Details</Text>

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
            
            <View key={item.orderItemId} >
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