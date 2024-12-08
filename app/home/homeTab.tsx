import { View, StyleSheet, RefreshControl, FlatList } from "react-native";
import { useState, useEffect, useCallback, useRef } from "react";
import Banner from "@/components/custom/banner";
import Search from "@/components/custom/search";
import CategoryList from "@/components/custom/category";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text } from "@/components/ui/text";
import { getCategories, Category } from "@/api/category";
import ProductList from "@/components/custom/ProductList";
import { ProductListRef } from "@/components/custom/ProductList";
import { useRouter } from "expo-router";

const HomeHeader = ({ categories, onSelectCategory }: { categories: Category[], onSelectCategory: (category: Category) => void }) => (
  <>
    <View style={styles.logoContainer}>
      <MaterialCommunityIcons name="flower-outline" size={24} color="black" />
      <Text style={styles.logoTitle}>FlowerStore</Text>
    </View>

    <View style={styles.searchContainer}>
      <Search />
    </View>

    <View style={styles.bannerContainer}>
      <Banner />
    </View>

    <View style={styles.categoryContainer}>
      <MaterialIcons name="category" size={24} color="black" />
      <Text style={styles.categoryTitle}>Categories</Text>
    </View>

    <View style={styles.categoryListContainer}>
      <CategoryList
        categories={categories}
        onSelectCategory={onSelectCategory}
      />
    </View>

    <View style={styles.productListContainer}>
      <MaterialIcons name="local-florist" size={24} color="black" />
      <Text style={styles.productListTitle}>Products</Text>
    </View>
  </>
);

const HomeTab = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const productListRef = useRef<ProductListRef>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const router = useRouter();

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCategories();
    productListRef.current?.handleRefresh();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSelectCategory = (category: Category) => {
    router.push(`/home/category/${category.categoryId}?name=${category.categoryName}`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <HomeHeader 
            categories={categories} 
            onSelectCategory={handleSelectCategory}
          />
        }
        data={[]} // Empty array since we're using ProductList separately
        renderItem={null}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        stickyHeaderIndices={[1]}
        ListFooterComponent={
          <View style={styles.productContainer}>
            <ProductList ref={productListRef} categoryId={selectedCategoryId} />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  searchContainer: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 10,
    zIndex: 1,
  },
  logoContainer: {
    width: "100%",
    marginTop: 10,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  bannerContainer: {
    height: 100,
    marginBottom: 10,
  },
  categoryListContainer: {
    height: 100,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 5,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  productListTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  productListContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 10,
    marginLeft: 10,
  },
  productContainer: {
    flex: 1,
    minHeight: 500,
  },
});

export default HomeTab;
