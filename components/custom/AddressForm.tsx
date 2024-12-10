import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { useAuthStore } from "@/store/authStore";
import { createAddress, updateAddress, getAddress } from "@/api/address";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { Keyboard } from "react-native";
import { Spinner } from "@/components/ui/spinner";
import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";

interface AddressFormProps {
  addressId?: number;
}

const AddressForm = ({ addressId }: AddressFormProps) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (addressId) {
      loadAddress();
    }
  }, [addressId]);

  const loadAddress = async () => {
    if (!user?.userId || !addressId) return;
    try {
      setIsLoading(true);
      const response = await getAddress(Number(user.userId), addressId);
      const address = response.data;
      setStreet(address.street);
      setDistrict(address.district);
      setCity(address.city);
    } catch (error) {
      console.error("Error loading address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user?.userId) return;
    setIsLoading(true);
    Keyboard.dismiss();
    try {
      if (addressId) {
        await updateAddress(Number(user.userId), addressId, {
          addressId: addressId,
          street,
          district,
          city,
        });
      } else {
        await createAddress(Number(user.userId), {
          addressId: 0,
          street,
          district,
          city,
        });
      }

      toast.show({
        placement: "top",
        render: () => (
          <Toast action="success">
            <ToastTitle>Success</ToastTitle>
            <ToastDescription>Address saved successfully</ToastDescription>
          </Toast>
        ),
      });

      router.back();
    } catch (error) {
      console.error("Error saving address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <Spinner size="large" color="rgb(156, 63, 70)" />
        </View>
      ) : (
        <VStack space="md">
          <Input>
            <InputField
              placeholder="Street"
              value={street}
              onChangeText={setStreet}
              style={style.inputField}
            />
          </Input>

          <Input>
            <InputField
              placeholder="District"
              value={district}
              onChangeText={setDistrict}
              style={style.inputField}
            />
          </Input>

          <Input>
            <InputField
              placeholder="City"
              value={city}
              onChangeText={setCity}
              style={style.inputField}
            />
          </Input>

          <Button onPress={handleSubmit} isDisabled={isLoading}>
            {isLoading ? (
              <ButtonSpinner />
            ) : (
              <ButtonText>{addressId ? "Update" : "Add"} Address</ButtonText>
            )}
          </Button>
        </VStack>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  inputField: {
    height: 40,
  },
});

export default AddressForm;
