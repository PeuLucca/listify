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
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, update } from 'firebase/database';

// Firebase Config
import { auth, database } from "../../firebaseConfig";

// Async Storage
import AsyncStorage from '@react-native-community/async-storage';

// This line is used to prevent yellow errors caused by Firebase in the application.
console.disableYellowBox = true;

const SignIn = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  // Form
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Handle functions
  const handleValidateUser = () => {
    if(email === "" || senha === ""){
      Alert.alert(
        'Atenção!',
        'Preencha os campos obrigatórios',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
      );
    }else{
        logUserIn();
    }
  };

  // LogIn functions
  const logUserIn = async () => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      const uid_data = user.uid;

      AsyncStorage.setItem('key_user_uid', uid_data);
      updateUserNode(uid_data);

      const savedEmail = AsyncStorage.setItem('key_email', email);
      navigation.navigate('Home');

    } catch (error) {
      Alert.alert(
        'Usuário/senha inválidas!',
        'Por favor, verifique os campos e tente novamente',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
      );
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode);
      console.error(errorMessage);
    }finally{
      setLoading(false);
    }
  };

  const updateUserNode = async (id) => {
    try{
      const date = new Date();
      const options = { timeZone: 'America/Sao_Paulo' };
      const dataHoraBrasil = date.toLocaleString('pt-BR', options);

      const userRef = ref(database, `users/${id}`);
      await update(userRef, { lastlogin: dataHoraBrasil });
    }catch(e){
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Log In</Text>
        <View style={styles.form}>
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
                : "Logar"
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

export default SignIn;
