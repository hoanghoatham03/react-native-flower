import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
import { Category } from "@/api/category";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");

interface CategoryListProps {
  categories: Category[];
  onSelectCategory?: (category: Category) => void;
}

const CATEGORY_IMAGES = [
  require("@/assets/categories/hoasinhnhat.webp"),
  require("@/assets/categories/lanhodiep.webp"),
  require("@/assets/categories/hoachucmung.webp"),
  require("@/assets/categories/hoacuoi.webp"),
  require("@/assets/categories/hoatangle.webp"),
  require("@/assets/categories/hoatinhyeu.webp"),
];

const CategoryList = ({ categories, onSelectCategory }: CategoryListProps) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const handleSelectCategory = (category: Category, index: number) => {
    setSelectedCategory(index);
    onSelectCategory?.(category);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category, index) => {
          const isSelected = selectedCategory === index;
          const placeholderImage = CATEGORY_IMAGES[index] || CATEGORY_IMAGES[0];

          return (
            <TouchableOpacity
              key={category.categoryId}
              style={[
                styles.categoryItem,
                isSelected && styles.selectedCategoryItem,
              ]}
              onPress={() => handleSelectCategory(category, index)}
            >
              <ImageBackground
                source={placeholderImage}
                style={styles.imageBackground}
                imageStyle={styles.imageStyle}
              >
                <View style={styles.overlayContent}>
                  <Text style={styles.categoryName} numberOfLines={2}>
                    {category.categoryName.split(" ").slice(0, 3).join(" ")}
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
  },
  scrollContent: {
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  categoryItem: {
    width: (width - 60) / 4,
    height: 85,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCategoryItem: {
    transform: [{ scale: 1.05 }],
  },
  imageBackground: {
    flex: 1,
    justifyContent: "flex-end",
  },
  imageStyle: {
    borderRadius: 15,
  },
  overlayContent: {
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  categoryName: {
    fontSize: 9,
    textAlign: "center",
    color: "white",
    marginTop: 8,
    fontWeight: "600",
  },
});

export default CategoryList;
