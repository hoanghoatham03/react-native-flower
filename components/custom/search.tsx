import React, { useState } from "react";
import { Input, InputField, InputIcon } from "@/components/ui/input";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: "/home/search",
        params: { query: searchQuery.trim() }
      });
      setSearchQuery("");
    }
  };

  return (
    <Input size="xl">
      <InputField
        placeholder="Let's find your flower"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      <Pressable onPress={handleSearch}>
        <AntDesign name="search1" size={20} color="black" className="mr-2"/>
      </Pressable>
    </Input>
  );
};

export default Search;
