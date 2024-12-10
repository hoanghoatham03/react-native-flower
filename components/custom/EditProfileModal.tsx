import React, { useState } from "react";
import { Modal, View, TouchableOpacity, Keyboard } from "react-native";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import * as ImagePicker from "expo-image-picker";
import {
  Avatar,
  AvatarImage,
  AvatarFallbackText,
} from "@/components/ui/avatar";
import { updateProfile } from "@/api/profile";
import { useAuthStore } from "@/store/authStore";
import { StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const EditProfileModal = ({ isVisible, onClose }: EditProfileModalProps) => {
  const { user, setUser } = useAuthStore();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || "");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!user?.userId) return;

    setIsLoading(true);
    Keyboard.dismiss();
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("mobileNumber", mobileNumber);

      if (avatar) {
        const filename = avatar.split("/").pop();
        const match = /\.(\w+)$/.exec(filename || "");
        const type = match ? `image/${match[1]}` : `image`;

        formData.append("avatar", {
          uri: avatar,
          name: filename,
          type,
        } as any);
      }

      const response = await updateProfile(Number(user.userId), formData);

      setUser({
        ...user,
        firstName,
        lastName,
        mobileNumber,
        avatar: response.avatar || response.data?.avatar || user.avatar,
      });

      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center bg-black/50">
        <View className="bg-white m-4 p-4 rounded-lg">
          <VStack space="md">
            <Text size="xl" bold>
              Edit Profile
            </Text>

            <TouchableOpacity onPress={pickImage} className="items-center">
              <View className="relative mb-2">
                <Avatar size="xl">
                  {avatar ? (
                    <AvatarImage source={{ uri: avatar }} />
                  ) : user?.avatar ? (
                    <AvatarImage source={{ uri: user.avatar }} />
                  ) : (
                    <AvatarFallbackText>
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </AvatarFallbackText>
                  )}
                </Avatar>
                <View className="absolute -bottom-2 right-2">
                  <MaterialCommunityIcons
                    name="camera"
                    size={24}
                    color="black"
                  />
                </View>
              </View>
            </TouchableOpacity>

            <Input>
              <InputField
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                style={styles.inputField}
              />
            </Input>

            <Input>
              <InputField
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                style={styles.inputField}
              />
            </Input>

            <Input>
              <InputField
                placeholder="Mobile Number"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                keyboardType="phone-pad"
                style={styles.inputField}
              />
            </Input>

            <Button onPress={handleSubmit} isDisabled={isLoading}>
              {isLoading ? (
                <ButtonSpinner />
              ) : (
                <ButtonText>Save Changes</ButtonText>
              )}
            </Button>

            <Button variant="outline" onPress={onClose} isDisabled={isLoading}>
              <ButtonText>Cancel</ButtonText>
            </Button>
          </VStack>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  inputField: {
    height: 40,
  },
});

export default EditProfileModal;
