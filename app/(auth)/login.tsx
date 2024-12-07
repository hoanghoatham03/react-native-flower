import { useRouter } from "expo-router";
import { View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

const LoginPage = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.replace("/home");
  };

  return (
    <View>
      <Text>LoginPage</Text>
      <Button onPress={handleLogin}>
        <ButtonText>Login</ButtonText>
      </Button>
    </View>
  );
};

export default LoginPage;
