import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfilePage from "./profile";
import HomeTab from "./homeTab";
const Tab = createBottomTabNavigator();

const HomePage = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="home" component={HomeTab} />
      <Tab.Screen name="profile" component={ProfilePage} />
    </Tab.Navigator>
  );
};

export default HomePage;
