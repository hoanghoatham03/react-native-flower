import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import PagerView from "react-native-pager-view";
import banner1 from "@/assets/banner1.webp";
import banner2 from "@/assets/banner2.webp";
import banner3 from "@/assets/banner3.webp";

const Banner = () => {
  return (
    <View style={styles.container}>
      <PagerView style={styles.container} initialPage={0}>
        <View style={styles.page} key="1">
          <Image source={banner1} style={styles.image} />
        </View>
        <View style={styles.page} key="2">
          <Image source={banner2} style={styles.image} />
        </View>
        <View style={styles.page} key="3">
          <Image source={banner3} style={styles.image} />
        </View>
      </PagerView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 130,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 130,
    resizeMode: "cover",
  },
});

export default Banner;
