import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
} from "react-native";
import { getProducts, Product } from "@/api/product";
import ProductCard from "./ProductCard";

export interface ProductListRef {
  handleRefresh: () => void;
  handleLoadMore: () => void;
}

const ProductList = forwardRef<ProductListRef>((_, ref) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(
    async (pageNo: number, isRefresh = false) => {
      if ((loading && !isRefresh) || (!hasMore && !isRefresh)) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getProducts(pageNo, 6);

        if (isRefresh) {
          setProducts(response.data);
          setPage(1);
        } else {
          setProducts((prev) => [...prev, ...response.data]);
          setPage((prevPage) => prevPage + 1);
        }

        setHasMore(response.data.length === 6);
      } catch (error) {
        console.error("Error loading products:", error);
        setError("Không thể tải sản phẩm. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore]
  );

  useEffect(() => {
    loadProducts(1);
  }, []);

  useImperativeHandle(ref, () => ({
    handleRefresh: () => loadProducts(1, true),
    handleLoadMore: () => handleLoadMore(),
  }));

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadProducts(page);
    }
  };

  const renderFooter = () => {
    if (loading) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color="#ff4d4f" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.footer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (!hasMore) {
      return (
        <View style={styles.footer}>
          <Text style={styles.noMoreText}>Không còn sản phẩm để hiển thị</Text>
        </View>
      );
    }

    return null;
  };

  const handleProductPress = (product: Product) => {
    // Handle product selection
    console.log("Selected product:", product);
  };

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <View style={styles.productItem}>
          <ProductCard product={item} onPress={handleProductPress} />
        </View>
      )}
      keyExtractor={(item, index) => `product-${item.productId}-${index}`}
      numColumns={2}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      contentContainerStyle={styles.container}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={21}
      scrollEnabled={false}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  productItem: {
    flex: 1,
    maxWidth: "50%",
    padding: 4,
  },
  footer: {
    padding: 16,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  noMoreText: {
    color: "gray",
    textAlign: "center",
  },
});

export default ProductList;
