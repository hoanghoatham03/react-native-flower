import { View } from "react-native";
import { Text } from "@/components/ui/text";
import AddressForm from "@/components/custom/AddressForm";

const NewAddressPage = () => {
  return (
    <View className="flex-1 bg-white">
      <View className="p-4">
        <Text size="2xl" bold>Add New Address</Text>
      </View>
      <AddressForm />
    </View>
  );
};

export default NewAddressPage; 