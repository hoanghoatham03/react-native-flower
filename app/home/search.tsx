import { View, StyleSheet, FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import { useState, useEffect } from "react";
import { Product, getProductByName } from "@/api/product";
import { Spinner } from "@/components/ui/spinner";
import ProductCard from "@/components/custom/ProductCard";
import AntDesign from "@expo/vector-icons/AntDesign";
import { TouchableOpacity } from "react-native";

const SearchScreen = () => {
  const { query } = useLocalSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const searchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProductByName(query as string);
        setProducts(response.data);
      } catch (error) {
        console.error("Error searching products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      searchProducts();
    }
  }, [query]);

  const handleProductPress = (product: Product) => {
    router.push(`/home/product/${product.productId}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Spinner size="large" color="rgb(156, 63, 70)" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Search Results</Text>
      </View>

      <Text style={styles.searchQuery}>Results for "{query}"</Text>
      {products.length === 1 ? (
        <View style={styles.productOneItem}>
          <ProductCard product={products[0]} onPress={handleProductPress} />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <ProductCard product={item} onPress={handleProductPress} />
            </View>
          )}
          keyExtractor={(item) => `search-${item.productId}`}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text>No products found</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
  searchQuery: {
    padding: 16,
    fontSize: 16,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 8,
  },
  productItem: {
    flex: 1,
  },
  productOneItem: {
    width: "50%",
    height: 250,
    marginHorizontal: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default SearchScreen;
