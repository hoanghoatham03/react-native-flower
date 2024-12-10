import { View, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { getAllAddress } from "@/api/address";
import { Address } from "@/api/address";
import { TouchableOpacity } from "react-native";
import { Spinner } from "@/components/ui/spinner";

const SelectAddressPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);

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
      pathname: "/home/checkout",
      params: { selectedAddress: JSON.stringify(address) }
    });
  };

  return (
    <View className="flex-1 bg-white">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <Spinner size="large" color="rgb(235, 75, 149)" />
        </View>
      ) : (
        <ScrollView>
          <VStack space="md" className="p-4">
            <Text size="2xl" bold>Select Address</Text>

            {addresses.map((address) => (
              <TouchableOpacity
                key={address.addressId}
                onPress={() => handleSelectAddress(address)}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <VStack space="xs">
                  <Text>Street: {address.street}</Text>
                  <Text>District: {address.district}</Text>
                  <Text>City: {address.city}</Text>
                </VStack>
              </TouchableOpacity>
            ))}
          </VStack>
        </ScrollView>
      )}
    </View>
  );
};

export default SelectAddressPage; 