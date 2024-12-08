import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfilePage from "./profile";
import HomeTab from "./homeTab";
const Tab = createBottomTabNavigator();
import AntDesign from "@expo/vector-icons/AntDesign";

const HomePage = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "rgb(235, 75, 149)",
      }}
    >
      <Tab.Screen
        name="home"
        component={HomeTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfilePage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default HomePage;
