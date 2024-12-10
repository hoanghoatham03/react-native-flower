import { useRouter } from "expo-router";
import { ImageBackground, Keyboard, View,Image,Dimensions} from "react-native";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { useState } from "react";
import { register } from "@/api/auth";
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
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  email?: string;
  password?: string;
}

const RegisterPage = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { setUser, setToken } = useAuthStore();

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!firstName) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName) {
      newErrors.lastName = "Last name is required";
    }

    if (!mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10,}$/.test(mobileNumber)) {
      newErrors.mobileNumber = "Invalid mobile number";
    }

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

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    Keyboard.dismiss();
    try {
      const response = await register(
        firstName,
        lastName,
        mobileNumber,
        email,
        password
      );

      setUser(response.data.user);
      setToken(response.data.ACCESS_TOKEN);
      
      router.push("/home");
    } catch (error) {
      console.log("Error:", error);
      setErrors({
        email: "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (    
      <ImageBackground source={bg} className="flex-1">
        <View className="flex-1 justify-start items-center p-4 tb-5">
          <View className="flex-2 w-full max-w-md rounded-2xl p-5 mt-16">
            <VStack space="lg" className="items-center">
              <Text size="4xl" bold className="text-[#D4DDDB]">
                Đăng Ký
              </Text>
              <Text size="xl" className="text-[#D4DDDB] mt-2">
              Đăng ký tài khoản ngay!
              </Text>
  
              <FormControl isInvalid={!!errors.firstName} className="w-full">
                <Input size="lg" className="rounded-xl">
                  <InputField
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={(text) => {
                      setFirstName(text);
                      setErrors((prev) => ({ ...prev, firstName: undefined }));
                    }}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorText>{errors.firstName}</FormControlErrorText>
                </FormControlError>
              </FormControl>
  
              <FormControl isInvalid={!!errors.lastName} className="w-full">
                <Input size="lg" className="rounded-xl">
                  <InputField
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={(text) => {
                      setLastName(text);
                      setErrors((prev) => ({ ...prev, lastName: undefined }));
                    }}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorText>{errors.lastName}</FormControlErrorText>
                </FormControlError>
              </FormControl>
  
              <FormControl isInvalid={!!errors.mobileNumber} className="w-full">
                <Input size="lg" className="rounded-xl">
                  <InputField
                    placeholder="Mobile Number"
                    value={mobileNumber}
                    onChangeText={(text) => {
                      setMobileNumber(text);
                      setErrors((prev) => ({ ...prev, mobileNumber: undefined }));
                    }}
                    keyboardType="phone-pad"
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorText>{errors.mobileNumber}</FormControlErrorText>
                </FormControlError>
              </FormControl>
  
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
                onPress={handleRegister}
                isDisabled={isLoading}
                className="bg-[#002D74] w-full rounded-xl mt-8"
              >
                {isLoading ? <ButtonSpinner /> : <ButtonText>Đăng Ký</ButtonText>}
              </Button>
  
              <Text size="md" className="mt-4 text-[#D4DDDB] underline">
                Quay lại đăng nhập
              </Text>
              <View className="flex-row justify-between items-center w-full mt-4">
                <Text size="md" className="text-[#D4DDDB]">
                  Đã có tài khoản?
                </Text>
                <Button
                  onPress={() => router.push("/login")}
                  className="bg-[#002D74] py-2 px-4 rounded-xl"
                >
                  <ButtonText className="text-white">Đăng Nhập</ButtonText>
                </Button>
              </View>
            </VStack>
          </View>
          <View>
        <Image
            source={require("@/assets/banner2.webp")}
            style={{ width: width, height: height * 0.2}}      
            resizeMode="contain"
          />
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
export default RegisterPage;
