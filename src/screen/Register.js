// Core
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from "../useAuth";

// Firebase
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import { getFirestore, collection, addDoc } from 'firebase/firestore';
import db from "@react-native-firebase/database";

const Register = () => {
  const navigation = useNavigation();
  const { login } = useAuth();
  const backgroundImage = { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhapcw-vU9Nt5hF39XiTpNlvv9R-UpSDLy7r_uqWmW_v76NUQ-W2ZGkpjDy_sCrzFHY_M&usqp=CAU' };

  // Form
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Handle functions
  const handleValidateUser = () => {
    if(nome === "" || email === "" || senha === ""){
      Alert.alert(
        'Atenção!',
        'Preencha os campos obrigatórios',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
      );
    }else{
      saveUser();
      handleClearInputs();
    }
  };

  const handleLogin = () => {
    // login();
    navigation.navigate('Minhas Listas');
  };

  const handleClearInputs = () => {
    setNome("");
    setEmail("");
    setSenha("");
  };

  // Database functions
  const saveUser = async () => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      const lastLoginTime = user.metadata.lastSignInTime;
  
      // Save user data to Firestore
      console.log(`UID --> ${user.uid}`);
      console.log(`Name --> ${nome}`);
      console.log(`Email --> ${user.email}`);
      console.log(`Último login --> ${lastLoginTime}`);

      // criar nó aqui!!!
  
      handleLogin();
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode);
      console.error(errorMessage);
    }
  };
  

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Cadastrar usuário</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            onChangeText={(text) => setNome(text)}
            value={nome}
          />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            onChangeText={(text) => setEmail(text)}
            value={email}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            onChangeText={(text) => setSenha(text)}
            value={senha}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleValidateUser}>
            <Text style={styles.buttonText}>Criar usuário</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: '100%',
    padding: 20,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: 'center',
    color: 'black',
  },
  input: {
    fontSize: 15,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
  },
});

export default Register;
