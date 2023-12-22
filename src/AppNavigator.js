// Core
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text } from 'react-native';

// Screens
import Login from './screen/Login';
import Home from './screen/Home';
import SignUp from './screen/SignUp';
import SignIn from "./screen/SingIn";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Listify"
          component={Login}
          options={{ 
            headerShown: true,
            headerLeft: null,
           }}
        />
        <Stack.Screen
          name="Minhas Listas"
          component={Home}
          options={{
            headerShown: true,
            headerLeft: null,
            headerStyle: {
              backgroundColor: '#FFFDFE',
            },
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => {
                  // Adicione a lógica de logout aqui
                  console.log("Logout Pressed");
                }}
              >
                <Text>Logout</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="Sign Up"
          component={SignUp}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Sign In"
          component={SignIn}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
