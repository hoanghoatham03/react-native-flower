import { View, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import ProductList from "@/components/custom/ProductList";
import { useRef } from "react";
import { ProductListRef } from "@/components/custom/ProductList";
import AntDesign from "@expo/vector-icons/AntDesign";
import { TouchableOpacity } from "react-native";

const CategoryDetailScreen = () => {
  const { id, name } = useLocalSearchParams();
  const productListRef = useRef<ProductListRef>(null);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{name}</Text>
      </View>
      <View style={styles.listContainer}>
        <ProductList ref={productListRef} categoryId={parseInt(id as string)} />
      </View>
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
  listContainer: {
    flex: 1,
  },
});

export default CategoryDetailScreen; 