import { View, StyleSheet, Alert } from "react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuthStore } from "@/store/authStore";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { logout } from "@/api/auth";
import { useState, useEffect } from "react";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import EditProfileModal from "@/components/custom/EditProfileModal";
import { TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import * as Location from "expo-location";
import { getMapfromLocation } from "@/api/map";

const ProfilePage = () => {
  const { user, setUser, setToken } = useAuthStore();
  const router = useRouter();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  useEffect(() => {
    // if (user?.avatar) {
    //console.log("Avatar URL:", user.avatar);
    // }
  }, [user?.avatar]);

  const handleLogout = () => {
    setUser(null);
    setToken("");
    logout();
    router.replace("/(auth)/login");
  };

  const handleAddressPress = () => {
    router.push("/home/address");
  };

  const handleLocationPress = () => {
    router.push("/home/map");
  };

  const name = user?.firstName + " " + user?.lastName;

  return (
    <View className="flex-1 bg-white">
      <Text size="2xl" bold className="px-4 pt-4">
        My Profile
      </Text>
      <VStack space="xl" className="p-4">
        <View className="items-center">
          <Avatar size="2xl">
            {user?.avatar ? (
              <AvatarImage
                source={{ uri: user.avatar }}
                className="w-full h-full"
              />
            ) : (
              <AvatarFallbackText className="text-white">
                {name}
              </AvatarFallbackText>
            )}
          </Avatar>

          <View className="flex-row items-center mt-4">
            <Text size="2xl" bold className="mr-2">
              {name}
            </Text>
            <TouchableOpacity onPress={() => setIsEditModalVisible(true)}>
              <Feather name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <VStack space="md" className="bg-gray-50 p-4 rounded-lg">
          <View className="flex-row justify-between items-center">
            <Text size="lg">Email</Text>
            <Text size="lg" className="text-gray-600">
              {user?.email}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text size="lg">Mobile</Text>
            <Text size="lg" className="text-gray-600">
              {user?.mobileNumber}
            </Text>
          </View>
        </VStack>

        <TouchableOpacity
          onPress={handleAddressPress}
          className="flex-row justify-between items-center bg-gray-50 p-4 rounded-lg"
        >
          <Text size="lg">Manage Addresses</Text>
          <Feather name="chevron-right" size={24} color="black" />
        </TouchableOpacity>

        <Button onPress={handleLogout} className="mt-8 bg-primary-600">
          <ButtonText>Logout</ButtonText>
        </Button>
      </VStack>

      <EditProfileModal
        isVisible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
      />
      <View style={styles.locationIconContainer}>
        <Entypo
          style={styles.locationIcon}
          name="location"
          size={30}
          color="rgb(156, 63, 70)"
          onPress={handleLocationPress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  locationIconContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  locationIcon: {
    marginBottom: 30,
    marginRight: 30,
  },
});

export default ProfilePage;
