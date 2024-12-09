import { View, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Address } from "@/api/address";
import { createOrder } from "@/api/order";
import {
  Radio,
  RadioGroup,
  RadioLabel,
  RadioIndicator,
  RadioIcon,
} from "@/components/ui/radio";
import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";
import { eventEmitter, CART_UPDATED } from "@/utils/eventEmitter";
import { CircleIcon } from "lucide-react-native";

enum PaymentMethod {
  CASH = "CASH",
  CREDIT_CARD = "CREDIT_CARD",
  PAYPAL = "PAYPAL",
}

const CheckoutPage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const params = useLocalSearchParams<{ selectedAddress: string }>();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH
  );
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (params.selectedAddress) {
      setSelectedAddress(JSON.parse(params.selectedAddress));
    }
  }, [params.selectedAddress]);

  const handleSelectAddress = () => {
    router.push("/home/checkout/select-address");
  };

  const handlePlaceOrder = async () => {
    if (!user?.userId || !selectedAddress) {
      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error">
            <ToastTitle>Error</ToastTitle>
            <ToastDescription>
              Please select a delivery address
            </ToastDescription>
          </Toast>
        ),
      });
      return;
    }

    setIsLoading(true);
    try {
      await createOrder(
        Number(user.userId),
        selectedAddress.addressId,
        getPaymentId(paymentMethod)
      );

      toast.show({
        placement: "top",
        render: () => (
          <Toast action="success">
            <ToastTitle>Success</ToastTitle>
            <ToastDescription>Order placed successfully</ToastDescription>
          </Toast>
        ),
      });

      eventEmitter.emit(CART_UPDATED);
      router.push("/home");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error">
            <ToastTitle>Error</ToastTitle>
            <ToastDescription>Failed to place order</ToastDescription>
          </Toast>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentId = (method: PaymentMethod): number => {
    switch (method) {
      case PaymentMethod.CASH:
        return 1;
      case PaymentMethod.CREDIT_CARD:
        return 2;
      case PaymentMethod.PAYPAL:
        return 3;
      default:
        return 1;
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <VStack space="xl" className="p-4">
        <Text size="2xl" bold>
          Checkout
        </Text>

        <VStack space="md" className="bg-gray-50 p-4 rounded-lg">
          <Text size="lg" bold>
            Delivery Address
          </Text>
          {selectedAddress ? (
            <VStack space="xs">
              <Text>{selectedAddress.street}</Text>
              <Text>{selectedAddress.district}</Text>
              <Text>{selectedAddress.city}</Text>
            </VStack>
          ) : (
            <Text className="text-gray-500">No address selected</Text>
          )}
          <Button onPress={handleSelectAddress} variant="outline">
            <ButtonText>
              {selectedAddress ? "Change" : "Select"} Address
            </ButtonText>
          </Button>
        </VStack>

        <VStack space="md" className="bg-gray-50 p-4 rounded-lg">
          <Text size="lg" bold>
            Payment Method
          </Text>
          <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
            <Radio value={PaymentMethod.CASH}>
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
              <RadioLabel>Cash on Delivery</RadioLabel>
            </Radio>
            <Radio value={PaymentMethod.CREDIT_CARD}>
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
              <RadioLabel>Credit Card</RadioLabel>
            </Radio>
            <Radio value={PaymentMethod.PAYPAL}>
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
              <RadioLabel>PayPal</RadioLabel>
            </Radio>
          </RadioGroup>
        </VStack>

        <Button
          onPress={handlePlaceOrder}
          isDisabled={isLoading || !selectedAddress}
          className="mt-4 bg-primary-600"
        >
          {isLoading ? <ButtonSpinner /> : <ButtonText>Place Order</ButtonText>}
        </Button>
      </VStack>
    </ScrollView>
  );
};

export default CheckoutPage;
