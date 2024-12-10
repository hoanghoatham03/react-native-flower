import { View, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useRouter } from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";

interface LocationOptionsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const LocationOptionsModal = ({ isVisible, onClose }: LocationOptionsModalProps) => {
  const router = useRouter();

  const handleCurrentLocation = () => {
    onClose();
    router.push("/home/map");
  };

  const handleCustomAddress = () => {
    onClose();
    router.push("/home/map/search");
};

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose Route Option</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <VStack space="lg" style={styles.options}>
            <TouchableOpacity
              style={styles.option}
              onPress={handleCurrentLocation}
            >
              <MaterialIcons name="my-location" size={24} color="rgb(156, 63, 70)" />
              <Text style={styles.optionText}>From Current Location</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={handleCustomAddress}
            >
              <Feather name="map-pin" size={24} color="rgb(156, 63, 70)" />
              <Text style={styles.optionText}>From Custom Address</Text>
            </TouchableOpacity>
          </VStack>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 200,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  options: {
    paddingVertical: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  optionText: {
    marginLeft: 15,
    fontSize: 16,
  },
});

export default LocationOptionsModal; 