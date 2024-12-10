import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { Product } from "@/api/product";
import AntDesign from "@expo/vector-icons/AntDesign";

interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
}

const ProductCard = ({ product, onPress }: ProductCardProps) => {
  const formatPrice = (price: number | undefined) => {
    if (!price) return "0 đ";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ";
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(product)}
    >
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.name}>
          {product.productName}
        </Text>
        <View style={styles.ratingContainer}>
          <AntDesign name="star" size={16} color="gold" />
          <AntDesign name="star" size={16} color="gold" />
          <AntDesign name="star" size={16} color="gold" />
          <AntDesign name="star" size={16} color="gold" />
          <AntDesign name="staro" size={16} color="gold" />
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.realPrice}>{formatPrice(product.realPrice)}</Text>
          {product.discount > 0 && (
            <Text style={styles.originalPrice}>
              {formatPrice(product.price)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  content: {
    padding: 8,
  },
  name: {
    fontSize: 14,
    height: 25,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  realPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ff4d4f",
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    color: "#999",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 4,
    marginBottom: 4,
  }
});

export default ProductCard;
