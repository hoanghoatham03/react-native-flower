import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { getOrder } from "@/api/order";
import { Spinner } from "@/components/ui/spinner";
import { Order } from "@/api/order";
import { useRouter } from "expo-router";
import { Divider } from "@/components/ui/divider";

const OrdersPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    if (!user?.userId) return;
    try {
      setIsLoading(true);
      const response = await getOrder(Number(user.userId));
      setOrders(response.data);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <Spinner size="large" color="rgb(235, 75, 149)" />
        </View>
      ) : (
        <ScrollView>
          <VStack space="md" className="p-4">
            <Text size="2xl" bold>My Orders</Text>
            {orders.map((order: Order) => (
              <TouchableOpacity
                key={order.orderId}
                onPress={() => router.push(`/home/orders/${order.orderId}`)}
                className="bg-gray-100 p-4 rounded-lg"
              >
                <VStack space="xs">
                  <Text bold>Order #{order.orderId}</Text>
                  <Divider />
                  <Text>Status: {order.orderStatus}</Text>
                  <Text>Total: {order.totalAmount.toLocaleString()} đ</Text>
                  <Text>Payment: {order.payment.paymentMethod}</Text>
                  <Text>Order Date: {order.orderDate}</Text>
                </VStack>
              </TouchableOpacity>
            ))}
          </VStack>
        </ScrollView>
      )}
    </View>
  );
};

export default OrdersPage; 