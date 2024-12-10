import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfilePage from "./profile";
import HomeTab from "./homeTab";
const Tab = createBottomTabNavigator();
import AntDesign from "@expo/vector-icons/AntDesign";
import CartPage from "./cart";
import OrderPage from "./order";
import Ionicons from "@expo/vector-icons/Ionicons";

const HomePage = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "rgb(156, 63, 70)",
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
        name="order"
        component={OrderPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="cart"
        component={CartPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="shoppingcart" color={color} size={size} />
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
