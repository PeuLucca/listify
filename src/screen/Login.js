// Core
import React from 'react';
import { StyleSheet, View, Button, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from "../useAuth";

const backgroundImage = { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhapcw-vU9Nt5hF39XiTpNlvv9R-UpSDLy7r_uqWmW_v76NUQ-W2ZGkpjDy_sCrzFHY_M&usqp=CAU' };

const Login = () => {
  const navigation = useNavigation();
  const { login } = useAuth();

  const handleLogin = () => {
    login();
    navigation.navigate('Minhas Listas');
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Button title='Login' onPress={handleLogin} />
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
});

export default Login;
