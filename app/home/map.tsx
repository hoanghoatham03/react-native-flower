import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { LOCATION_SHOP } from "@/utils/appConstant";
import { getDistance, getDirection } from "@/api/map";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import polyline from '@mapbox/polyline';

interface RouteInfo {
  distance: string;
  duration: string;
  points: { latitude: number; longitude: number }[];
}

const MapScreen = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);

        // Get distance and duration
        const distanceData = await getDistance(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        );

        // Get route points
        const directionData = await getDirection(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        );

        if (directionData && 
            directionData.routes && 
            directionData.routes[0] && 
            directionData.routes[0].overview_polyline) {
          
          // Decode the polyline string into coordinates
          const decodedPoints = polyline.decode(directionData.routes[0].overview_polyline.points);
          
          // Convert to the format we need
          const points = decodedPoints.map(point => ({
            latitude: point[0],
            longitude: point[1]
          }));

          setRouteInfo({
            distance: distanceData?.rows?.[0]?.elements?.[0]?.distance?.text || "Unknown",
            duration: distanceData?.rows?.[0]?.elements?.[0]?.duration?.text || "Unknown",
            points: points,
          });
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading || !location) {
    return (
      <View style={styles.loadingContainer}>
        <Spinner size="large" color="rgb(156, 63, 70)" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Route to Shop</Text>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="Your Location"
        />
        <Marker
          coordinate={LOCATION_SHOP}
          title="Shop Location"
          pinColor="red"
        />
        {routeInfo?.points && routeInfo.points.length > 0 && (
          <Polyline
            coordinates={routeInfo.points}
            strokeColor="rgb(156, 63, 70)"
            strokeWidth={3}
          />
        )}
      </MapView>

      {routeInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Distance: {routeInfo.distance}</Text>
          <Text style={styles.infoText}>
            Estimated Time: {routeInfo.duration}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default MapScreen; 