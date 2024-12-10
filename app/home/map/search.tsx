import { View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { searchPlaces, getPlaceDetail } from "@/api/map";
import { Spinner } from "@/components/ui/spinner";
import debounce from 'lodash/debounce';

interface Prediction {
    description: string;
    place_id: string;
}

const SearchLocationScreen = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const debouncedSearch = debounce(async (text: string) => {
        if (text.length < 2) {
            setPredictions([]);
            return;
        }
        setIsLoading(true);
        const results = await searchPlaces(text);
        setPredictions(results);
        setIsLoading(false);
    }, 500);

    useEffect(() => {
        debouncedSearch(searchQuery);
        return () => debouncedSearch.cancel();
    }, [searchQuery]);

    const handleSelectPlace = async (placeId: string) => {
        setIsLoading(true);
        const placeDetail = await getPlaceDetail(placeId);
        if (placeDetail && placeDetail.geometry) {
            const location = {
                latitude: placeDetail.geometry.location.lat,
                longitude: placeDetail.geometry.location.lng,
                address: placeDetail.formatted_address
            };
            router.push({
                pathname: "/home/map",
                params: { 
                    customLocation: JSON.stringify(location)
                }
            });
        }
        setIsLoading(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Search Location</Text>
            </View>

            <View style={styles.searchContainer}>
                <Feather name="search" size={20} color="gray" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for a location..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity 
                        onPress={() => setSearchQuery("")}
                        style={styles.clearButton}
                    >
                        <Feather name="x" size={20} color="gray" />
                    </TouchableOpacity>
                )}
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <Spinner size="large" color="rgb(156, 63, 70)" />
                </View>
            ) : (
                <VStack space="md" style={styles.predictionsList}>
                    {predictions.map((prediction) => (
                        <TouchableOpacity
                            key={prediction.place_id}
                            style={styles.predictionItem}
                            onPress={() => handleSelectPlace(prediction.place_id)}
                        >
                            <Feather name="map-pin" size={20} color="rgb(156, 63, 70)" />
                            <Text style={styles.predictionText}>
                                {prediction.description}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </VStack>
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
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        padding: 8,
    },
    clearButton: {
        padding: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    predictionsList: {
        padding: 16,
    },
    predictionItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    predictionText: {
        marginLeft: 12,
        fontSize: 16,
    },
});

export default SearchLocationScreen; 