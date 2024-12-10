import { View } from "react-native";
import { Text } from "@/components/ui/text";
import AddressForm from "@/components/custom/AddressForm";
import { useLocalSearchParams } from "expo-router";

const EditAddressPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 bg-white">
      <View className="p-4">
        <Text size="2xl" bold>Edit Address</Text>
      </View>
      <AddressForm addressId={Number(id)} />
    </View>
  );
};

export default EditAddressPage; 