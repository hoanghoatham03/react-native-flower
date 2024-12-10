import { useRouter } from "expo-router";
import {
  ImageBackground,
  Keyboard,
  View,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
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
const { width, height } = Dimensions.get("window");
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
      <View style={styles.overlay}></View>
      <View className="flex-1 justify-start items-center p-4 tb-5">
        <View className="flex-2 w-full max-w-md rounded-2xl p-5 mt-16">
          <VStack space="lg" className="items-center">
            <Text size="4xl" bold className="text-[#D4DDDB]">
              Đăng Nhập
            </Text>
            <Text size="xl" className="text-[#D4DDDB] mt-2">
              Nếu đã có tài khoản, đăng nhập dễ dàng
            </Text>

            <FormControl isInvalid={!!errors.email} className="w-full">
              <Input size="lg" className="rounded-xl">
                <InputField
                  placeholder="Email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.inputText}
                />
              </Input>
              <FormControlError>
                <FormControlErrorText>{errors.email}</FormControlErrorText>
              </FormControlError>
            </FormControl>

            <FormControl isInvalid={!!errors.password} className="w-full">
              <Input size="lg" className="rounded-xl">
                <InputField
                  placeholder="Password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  type={showPassword ? "text" : "password"}
                  secureTextEntry={!showPassword}
                  style={styles.inputText}
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
              className="bg-[#002D74] w-full rounded-xl mt-8"
            >
              {isLoading ? (
                <ButtonSpinner />
              ) : (
                <ButtonText>Đăng Nhập</ButtonText>
              )}
            </Button>

            <Text size="md" className="mt-4 text-[#D4DDDB] underline">
              Quên mật khẩu?
            </Text>

            <View className="flex-row justify-between items-center w-full mt-4">
              <Text size="md" className="text-[#D4DDDB]">
                Nếu bạn không có tài khoản ....
              </Text>
              <Button
                onPress={() => router.push("/register")}
                className="bg-[#002D74] py-2 px-4 rounded-xl"
              >
                <ButtonText className="text-white">Đăng Ký</ButtonText>
              </Button>
            </View>
          </VStack>
        </View>
        <View className="flex-1 w-full justify-end items-center">
          <Text size="sm" className="text-[#D4DDDB]">
            © 2023 - All rights reserved.
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  inputText: {
    color: "white",
    height: 50,
  },
});

export default LoginPage;
