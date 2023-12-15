import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../pages/home';
import CharityProject from '../pages/charityProject';
import Cart from '../pages/cart';
import NoInternet from '../component/NoInternet';
import NetInfo from "@react-native-community/netinfo";

const Stack = createNativeStackNavigator();
const AppNavigation = () => {

  return (
  <>

    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        /> 
         <Stack.Screen
          name="charityProject"
          component={CharityProject}
          options={{headerShown: false}}
        /> 
         <Stack.Screen
          name="cart"
          component={Cart}
          options={{headerShown: false}}
        /> 
     
      </Stack.Navigator>
    </NavigationContainer>
</>

  );
};

export default AppNavigation;
