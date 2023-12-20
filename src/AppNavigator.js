// Core
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import Login from './screen/Login';
import Home from './screen/Home';
import Register from './screen/Register';

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
            headerStyle: {
              
            },
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
          }}
        />
        <Stack.Screen
          name="Novo usuário"
          component={Register}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
