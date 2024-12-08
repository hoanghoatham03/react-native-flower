import { useRouter } from "expo-router";
import { ImageBackground, Keyboard, View } from "react-native";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { useState } from "react";
import { login } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
} from "@/components/ui/form-control";
import Feather from "@expo/vector-icons/Feather";
import bg from "@/assets/bg.jpg";

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { setUser, setToken } = useAuthStore();

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    Keyboard.dismiss();
    try {
      
      const response = await login(email, password);
      
      setUser(response.data.user); // fix api add user info
      setToken(response.data.ACCESS_TOKEN);
      
      router.push("/home");
    } catch (error) {
      console.log("Error:", error);
      setErrors({
        email: "Invalid email or password",
        password: "Invalid email or password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground source={bg} className="flex-1">
      <View className="flex-1 justify-center p-4 bg-white/80">
        <VStack space="xl">
          <Text size="2xl" bold className="text-center mb-8">
            Login to your account
          </Text>

          <FormControl isInvalid={!!errors.email}>
            <Input size="xl">
              <InputField
                placeholder="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </Input>
            <FormControlError>
              <FormControlErrorText>{errors.email}</FormControlErrorText>
            </FormControlError>
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <Input size="xl">
              <InputField
                placeholder="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                type={showPassword ? "text" : "password"}
                secureTextEntry={!showPassword}
              />
              <InputSlot
                className="mx-2"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Feather
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="black"
                />
              </InputSlot>
            </Input>
            <FormControlError>
              <FormControlErrorText>{errors.password}</FormControlErrorText>
            </FormControlError>
          </FormControl>

          <Button
            onPress={handleLogin}
            isDisabled={isLoading}
            className="bg-primary-600"
          >
            {isLoading ? <ButtonSpinner /> : <ButtonText>Login</ButtonText>}
          </Button>
        </VStack>
      </View>
    </ImageBackground>
  );
};

export default LoginPage;
