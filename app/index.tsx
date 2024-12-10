import { StyleSheet, View, ImageBackground, Image } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import bg from "@/assets/bg.jpg";
import { useRouter } from "expo-router";
import logoshop from "@/assets/logoshop.png";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <ImageBackground source={bg} style={styles.container}>
      <View style={styles.rightContainer}>
        <VStack style={styles.textContainer}>
          <Text size="4xl" bold style={styles.welcomeText}>
            Welcome to
          </Text>

          <Image
            source={logoshop}
            style={styles.logo}
          />

          <HStack style={styles.buttons}>
            <Button
              style={styles.button}
              onPress={() => router.push("(auth)/login")}
            >
              <ButtonText> Log in </ButtonText>
            </Button>
            <Button
              style={styles.button}
              onPress={() => router.push("(auth)/register")}
            >
              <ButtonText>Sign up</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  rightContainer: {
    width: 250,
    height: 450,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: "100%",
  },
  welcomeText: {
    fontFamily: "Playball",
    color: "#B04E54",
    marginBottom: 50,
    justifyContent: "center",
    textAlign: "center",
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 40,
  },
  buttons: {
    flexDirection: "row",
    gap: 15,
    marginTop: 40,
  },
  button: {
    width: "45%",
  },
});
