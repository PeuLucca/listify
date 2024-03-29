// Core
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from 'firebase/database';

// Firebase Config
import { auth, database } from "../../firebaseConfig";

// Async Storage
import AsyncStorage from '@react-native-community/async-storage';

// This line is used to prevent yellow errors caused by Firebase in the application.
console.disableYellowBox = true;

const SignUp = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

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

  const handleClearInputs = () => {
    setNome("");
    setEmail("");
    setSenha("");
  };

  // Firebase functions
  const saveUser = async () => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      const uid_data = user.uid;
      const email_data = user.email;
      const lastLoginTime_data = user.metadata.lastSignInTime;
  
      AsyncStorage.setItem('key_user_uid', uid_data);
      AsyncStorage.setItem('key_email', email);
      createUserNode(uid_data, nome, email_data, lastLoginTime_data);
      navigation.navigate('Home');
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode);
      console.error(errorMessage);
    }finally{
      setLoading(false);
    }
  };

  const createUserNode = async (id, nome, email) => {
    try{
      const date = new Date();
      const options = { timeZone: 'America/Sao_Paulo' };
      const dataHoraBrasil = date.toLocaleString('pt-BR', options);

      const dataRef = ref(database, `users/${id}`);
      const userData = {
        nome,
        email,
        lastlogin: dataHoraBrasil,
      };
      await set(dataRef, userData);
    }catch(e){
      console.error(e);
    }
  };

  return (
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
            <Text style={styles.buttonText}>
              {
                loading
                ? <ActivityIndicator size="small" color="white" />
                : "Criar usuário"
              }
            </Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
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

export default SignUp;
