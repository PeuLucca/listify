import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from "../useAuth";

// Api
import { getUser, insertUser } from '../api';

const backgroundImage = { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhapcw-vU9Nt5hF39XiTpNlvv9R-UpSDLy7r_uqWmW_v76NUQ-W2ZGkpjDy_sCrzFHY_M&usqp=CAU' };

const Login = () => {
  const navigation = useNavigation();
  const { login } = useAuth();

  // Form
  const [nome, setNome] = useState("");
  const [ultimoLogin, setUltimoLogin] = useState("");

  const handleLogin = () => {
    login();
    navigation.navigate('Minhas Listas');
  };

  const handleNewuser = () => {
    console.warn("New user screen!!");
  };

  const fetchUsers = async () => {
    try {
      const response = await getUser();
      console.warn('Fetched users:', response);
    } catch (e) {
      console.warn('Error fetching users:', e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [])

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.newUserBox} onPress={handleNewuser}>
          <View onPress={handleNewuser}>
            <Text style={styles.plus}>+</Text>
          </View>
        </TouchableOpacity>
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
});

export default Login;
