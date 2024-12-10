import { View, StyleSheet, Image } from "react-native";
import { Text } from "@/components/ui/text";
import { CartItem as CartItemType } from "@/api/cart";
import { NumericInput } from "@/components/custom/numeric-input";
import AntDesign from "@expo/vector-icons/AntDesign";
import { updateCartItem, removeFromCart } from "@/api/cart";
import { useAuthStore } from "@/store/authStore";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: () => void;
  onRemove: () => void;
}

export const CartItem = ({
  item,
  onQuantityChange,
  onRemove,
}: CartItemProps) => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity);
  const toast = useToast();

  const handleQuantityChange = async (quantity: number) => {
    if (!user) return;
    try {
      setQuantity(quantity);
      await updateCartItem(
        user.userId as unknown as number,
        item.product.productId,
        quantity
      );
      onQuantityChange();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemove = async () => {
    if (!user) return;
    try {
      setLoading(true);
      await removeFromCart(
        user.userId as unknown as number,
        item.product.productId
      );
      onRemove();
      toast.show({
        placement: "top",
        render: () => (
          <Toast action="success">
            <ToastTitle>Success</ToastTitle>
            <ToastDescription>
              Item removed from cart successfully
            </ToastDescription>
          </Toast>
        ),
      });
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri:
            item.product.images?.[0]?.imageUrl ||
            item.product.imageUrl ||
            "https://placeholder.com/150",
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {item.product.productName}
        </Text>
        <Text style={styles.price}>
          {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} đ
        </Text>
        <View style={styles.actions}>
          <NumericInput
            value={quantity}
            onChange={(v) => {
              setQuantity(v);
              handleQuantityChange(v);
            }}
            minValue={1}
            maxValue={item.product.stock}
          />
          {loading ? (
            <Spinner color="rgb(156, 63, 70)" />
          ) : (
            <AntDesign
              name="delete"
              size={24}
              color="black"
              onPress={handleRemove}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: "#ff4d4f",
    fontWeight: "bold",
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
