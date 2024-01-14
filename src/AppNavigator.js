// Core
import React, { useEffect, useState } from 'react';
import { NavigationContainer  } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Screens
import Login from './screen/Login';
import Home from './screen/Home';
import SignUp from './screen/SignUp';
import SignIn from "./screen/SingIn";
import NewList from './screen/NewList';
import ItemList from './screen/ItemList';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isUserlogged, setIsUserLogged] = useState({ logged: true, newUser: true });

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ 
            headerShown: true,
            headerLeft: null,
           }}
        />
        <Stack.Screen
          name="Home"
          children={() => (<Home isUserlogged={isUserlogged} />)}
          options={{
            headerShown: true,
            headerLeft: null,
            headerStyle: {
              backgroundColor: '#FFFDFE',
            },
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => setIsUserLogged({logged: false, newUser: false})}
              >
                <MaterialCommunityIcons
                  name="logout"
                  size={24}
                  color="black"
                />
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
        <Stack.Screen
          name="Nova Lista"
          component={NewList}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Lista"
          component={ItemList}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
