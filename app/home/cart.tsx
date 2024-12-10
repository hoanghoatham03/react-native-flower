import { View, StyleSheet, FlatList } from "react-native";
import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import { Cart, getCart } from "@/api/cart";
import { CartItem } from "@/components/custom/CartItem";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { eventEmitter, CART_UPDATED } from "@/utils/eventEmitter";
import { Button, ButtonText } from "@/components/ui/button";

export default function CartScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      if (!user) {
        router.replace("/auth/login");
        return;
      }
      const data = await getCart(user.userId as unknown as number);
      setCart(data.data);
    } catch (error) {
      console.error("Error loading cart:", error);
      if (
        error instanceof Error &&
        error.message === "User not authenticated"
      ) {
        router.replace("/auth/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
    const handleCartUpdate = () => {
      loadCart();
    };
    eventEmitter.on(CART_UPDATED, handleCartUpdate);
    return () => {
      eventEmitter.off(CART_UPDATED, handleCartUpdate);
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Spinner size="large" color="rgb(156, 63, 70)" />
      </View>
    );
  }

  if (!cart?.cartItems?.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text size="2xl" bold className="px-4 pt-4">
        My Cart
      </Text>
      <FlatList
        data={cart.cartItems}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onQuantityChange={loadCart}
            onRemove={loadCart}
          />
        )}
        keyExtractor={(item) => `cart-item-${item.cartItemId}`}
        ListFooterComponent={() => (
          <View style={styles.footer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalPrice}>
              {cart.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              đ
            </Text>
          </View>
        )}
      />
      <Button
        onPress={() => router.push("/home/checkout")}
        className="m-4 bg-primary-600"
      >
        <ButtonText>Proceed to Checkout</ButtonText>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  footer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff4d4f",
  },
});
