import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuthStore } from "@/store/authStore";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { logout } from "@/api/auth";

const ProfilePage = () => {
  const { user, setUser, setToken } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    setToken("");
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <View className="flex-1 p-4">
      <VStack space="md">
        <Text size="2xl" bold>
          Profile
        </Text>

        <VStack space="xs">
          <Text size="lg">
            Name: {user?.firstName} {user?.lastName}
          </Text>
          <Text size="lg">Email: {user?.email}</Text>
          <Text size="lg">Mobile: {user?.mobileNumber}</Text>
        </VStack>

        <Button onPress={handleLogout} className="mt-8">
          <ButtonText>Logout</ButtonText>
        </Button>
      </VStack>
    </View>
  );
};

export default ProfilePage;
