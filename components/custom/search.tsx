import React from "react";
import { View } from "react-native";

import { Input, InputField, InputIcon } from "@/components/ui/input";
import AntDesign from "@expo/vector-icons/AntDesign";

const Search = () => {
  return (
    <>
      <Input size="xl">
        <InputField placeholder="Let's find your flower" />

        <AntDesign name="search1" size={20} color="black" />
      </Input>
    </>
  );
};

export default Search;
