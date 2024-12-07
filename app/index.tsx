import { StyleSheet, View, ImageBackground } from "react-native";

import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import bg from "@/assets/bg.jpg";
import { useRouter } from "expo-router";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <ImageBackground source={bg} style={styles.container}>
      <Text size="6xl" bold className="h-1/2 top-40 text-gray-800">
        Welcome to the app
      </Text>
      <HStack style={styles.buttons}>
        <Button className="w-1/2" onPress={() => router.push("(auth)/login")}>
          <ButtonText>Log in</ButtonText>
        </Button>
        <Button
          className="w-1/2"
          onPress={() => router.push("(auth)/register")}
        >
          <ButtonText>Sign up</ButtonText>
        </Button>
      </HStack>
      <Divider className="bg-gray-300 my-4" />
      <Text size="lg" className="text-center w-full">
        I will sign up later
      </Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 24,
  },

  buttons: {
    width: "100%",
    justifyContent: "space-between",
    gap: 10,
  },
});
