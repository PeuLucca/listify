// Core
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Button,
  ImageBackground
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// UseAuth
import { useAuth } from "../useAuth";

const Login = () => {
  const backgroundImage = { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhapcw-vU9Nt5hF39XiTpNlvv9R-UpSDLy7r_uqWmW_v76NUQ-W2ZGkpjDy_sCrzFHY_M&usqp=CAU' };
  const { login } = useAuth();
  const navigation = useNavigation();

  // Handle functions
  const handleLogin = () => {
    login();
    navigation.navigate('Minhas Listas');
  };

  const handleNewuser = () => {
    navigation.navigate('Novo usuário');
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.newUserBox} onPress={handleNewuser}>
          <View>
            <Text style={styles.plus}>+</Text>
          </View>
        </TouchableOpacity>
        <View>
          <Button title='Login' onPress={handleLogin} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  userBox: {

  },
  newUserBox: {
    width: "65%",
    height: 120,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'gray',
    borderStyle: 'dashed',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plus: {
    fontSize: 40,
    color: 'gray',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: '100%',
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: 'green',
  },
  closeButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
  },
});

export default Login;
