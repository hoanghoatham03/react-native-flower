import { View, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { getAllAddress, deleteAddress } from "@/api/address";
import { Address } from "@/api/address";
import Feather from "@expo/vector-icons/Feather";
import { TouchableOpacity } from "react-native";
import { Spinner } from "@/components/ui/spinner";

const AddressPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);

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

  useFocusEffect(
    useCallback(() => {
      loadAddresses();
    }, [user?.userId])
  );

  const handleAddAddress = () => {
    router.push("/home/address/new");
  };

  const handleEditAddress = (addressId: number) => {
    router.push(`/home/address/${addressId}`);
  };

  const handleDeleteAddress = async (addressId: number) => {
    setIsLoading(true);
    if (!user?.userId) return;
    try {
      await deleteAddress(Number(user.userId), addressId);
      loadAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
    }
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
            <Text size="2xl" bold>
              My Addresses
            </Text>

            {addresses.map((address) => (
              <View
                key={address.addressId}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <View className="flex-row justify-between">
                  <VStack space="xs">

                    <Text>Street: {address.street}</Text>
                    <Text>District: {address.district}</Text>
                    <Text>City: {address.city}</Text>
                  </VStack>
                  <VStack space="sm">
                    <TouchableOpacity
                      onPress={() => handleEditAddress(address.addressId)}
                    >
                      <Feather name="edit" size={20} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteAddress(address.addressId)}
                    >

                      <Feather name="trash-2" size={20} color="red" />
                    </TouchableOpacity>
                  </VStack>
                </View>
              </View>
            ))}

            <Button onPress={handleAddAddress} className="mt-4 bg-primary-600">
              <ButtonText>Add New Address</ButtonText>
            </Button>
          </VStack>
        </ScrollView>
      )}
    </View>
  );
};

export default AddressPage;
