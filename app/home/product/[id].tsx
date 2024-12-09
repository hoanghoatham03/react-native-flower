import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import { Product, getProductById } from "@/api/product";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FlatList } from "react-native";
import { Spinner } from "@/components/ui/spinner";
import { APP_COLORS } from "@/utils/appConstant";
import { Divider } from "@/components/ui/divider";
import { addToCart } from "@/api/cart";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import { NumericInput } from "@/components/custom/numeric-input";
import { useAuthStore } from "@/store/authStore";
import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";
import { eventEmitter, CART_UPDATED } from "@/utils/eventEmitter";

const { width } = Dimensions.get("window");

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { user } = useAuthStore();
  const toast = useToast();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(parseInt(id as string));
        setProduct(data.data);
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const formatPrice = (price: number | undefined) => {
    if (!price) return "0 đ";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ";
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setIsAddingToCart(true);
      await addToCart(
        user?.userId as unknown as number,
        product.productId,
        quantity
      );
      eventEmitter.emit(CART_UPDATED);
      toast.show({
        placement: "top",
        render: () => (
          <Toast action="success">
            <ToastTitle>Success</ToastTitle>
            <ToastDescription>Item added to cart successfully</ToastDescription>
          </Toast>
        ),
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error">
            <ToastTitle>Error</ToastTitle>
            <ToastDescription>Failed to add item to cart</ToastDescription>
          </Toast>
        ),
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading || !product) {
    return (
      <View style={styles.loadingContainer}>
        <Spinner size="large" color="rgb(235, 75, 149)" />
      </View>
    );
  }

  const allImages = [
    ...(product.images?.map((img) => img.imageUrl) || []),
    product.imageUrl,
  ].filter(Boolean);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Product Details</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: allImages[selectedImageIndex] }}
          style={styles.mainImage}
          resizeMode="cover"
        />
        {allImages.length > 1 && (
          <View style={styles.thumbnailContainer}>
            <FlatList
              horizontal
              data={allImages}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => setSelectedImageIndex(index)}
                  style={[
                    styles.thumbnailButton,
                    selectedImageIndex === index && styles.selectedThumbnail,
                  ]}
                >
                  <Image
                    source={{ uri: item }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(_, index) => `image-${index}`}
            />
          </View>
        )}
        <View style={styles.content}>
          <Text style={styles.productName}>{product.productName}</Text>
          <View style={styles.ratingContainer}>
            <AntDesign name="star" size={16} color="gold" />
            <AntDesign name="star" size={16} color="gold" />
            <AntDesign name="star" size={16} color="gold" />
            <AntDesign name="star" size={16} color="gold" />
            <AntDesign name="staro" size={16} color="gold" />
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.realPrice}>
              {formatPrice(product.realPrice)}
            </Text>
            {product.discount > 0 && (
              <View style={styles.discountContainer}>
                <Text style={styles.originalPrice}>
                  {formatPrice(product.price)}
                </Text>
                <Text style={styles.discountBadge}>-{product.discount}%</Text>
              </View>
            )}
          </View>
          <Divider />
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>Category:</Text>
            <Text style={styles.categoryName}>{product.categoryName}</Text>
          </View>
          <View style={styles.stockContainer}>
            <Text style={styles.stockLabel}>Stock:</Text>
            <Text style={styles.stockValue}>{product.stock}</Text>
          </View>
          <Divider />
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Description:</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <NumericInput
          minValue={1}
          maxValue={100}
          value={quantity}
          onChange={(v) => {
            setQuantity(v);
          }}
        />
        <Button
          onPress={handleAddToCart}
          disabled={isAddingToCart || !product?.stock}
        >
          <ButtonText>
            {isAddingToCart ? <ButtonSpinner /> : "Add to Cart"}
          </ButtonText>
        </Button>
      </View>
    </View>
  );
};

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
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  mainImage: {
    width: width,
    height: width,
  },
  thumbnailContainer: {
    padding: 8,
  },
  thumbnailButton: {
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedThumbnail: {
    borderColor: "#ff4d4f",
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  content: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    paddingTop: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    gap: 8,
    marginBottom: 8,
  },
  discountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  realPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff4d4f",
    paddingTop: 10,
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: "line-through",
    color: "#999",
  },
  discountBadge: {
    backgroundColor: "#ff4d4f",
    color: "white",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
  },
  categoryContainer: {
    flexDirection: "row",
    marginVertical: 8,
  },
  categoryLabel: {
    fontWeight: "bold",
    marginRight: 8,
  },
  categoryName: {
    color: "#666",
  },
  stockContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  stockLabel: {
    fontWeight: "bold",
    marginRight: 8,
  },
  stockValue: {
    color: "#666",
  },
  descriptionContainer: {
    marginBottom: 40,
    marginTop: 4,
  },
  descriptionLabel: {
    fontWeight: "bold",
  },
  description: {
    color: "#666",
    lineHeight: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 4,
    marginVertical: 4,
  },
});

export default ProductDetailScreen;
