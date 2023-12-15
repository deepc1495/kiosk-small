import { View,ActivityIndicator } from "react-native";
import React from "react";
// import { ActivityIndicator } from "react-native-paper";

export default function Loader({loader}) {
  return (
   <>
    {loader &&  <View style={{display:'flex',flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#00000059',backgroundColor:'#fff',position:'absolute',width:'100%',height:'100%'}}>
      <ActivityIndicator size='large' color='rgba(54,176,201,1)'/>
    </View>}
   </>
  );
}
