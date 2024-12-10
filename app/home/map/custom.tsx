import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { getAllAddress } from "@/api/address";
import { Address } from "@/api/address";
import { Feather } from "@expo/vector-icons";
import { Spinner } from "@/components/ui/spinner";

const CustomRouteScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    if (!user?.userId) return;
    try {
      setIsLoading(true);
      const response = await getAllAddress(Number(user.userId));
      setAddresses(response.data);
    } catch (error) {
      console.error("Error loading addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAddress = (address: Address) => {
    router.push({
      pathname: "/home/map",
      params: { 
        customAddress: JSON.stringify(address)
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Select Starting Address</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Spinner size="large" color="rgb(156, 63, 70)" />
        </View>
      ) : (
        <ScrollView>
          <VStack space="md" style={styles.addressList}>
            {addresses.map((address) => (
              <TouchableOpacity
                key={address.addressId}
                style={styles.addressItem}
                onPress={() => handleSelectAddress(address)}
              >
                <VStack space="xs">
                  <Text>Street: {address.street}</Text>
                  <Text>District: {address.district}</Text>
                  <Text>City: {address.city}</Text>
                </VStack>
                <Feather name="chevron-right" size={24} color="black" />
              </TouchableOpacity>
            ))}
          </VStack>
        </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addressList: {
    padding: 16,
  },
  addressItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
  },
});

export default CustomRouteScreen; 