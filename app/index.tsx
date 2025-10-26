" use dom";

import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

const index = () => {
  const router = useRouter()

  useEffect(()=>{
    setTimeout(()=>{
      router.replace("/home")
    },2000)
  },[])
  return (
    <View>
      <Text>Hello Snaki</Text>
    </View>
  );
};

export default index;
