// Core
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Firebase
import { ref, get } from 'firebase/database';

// Firebase Config
import { auth, database } from '../../firebaseConfig';

// Async Storage
import AsyncStorage from '@react-native-community/async-storage';

// This line is used to prevent yellow errors caused by Firebase in the application.
console.disableYellowBox = true;

const Login = () => {
  const backgroundImage = {
    uri:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhapcw-vU9Nt5hF39XiTpNlvv9R-UpSDLy7r_uqWmW_v76NUQ-W2ZGkpjDy_sCrzFHY_M&usqp=CAU',
  };
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [allUsers, setAllUsers] = useState([]);

  // Handle functions
  const handleLogin = () => {
    navigation.navigate('Sign In');
  };

  const handleNewuser = () => {
    navigation.navigate('Sign Up');
  };

  const handleGoHome = async (obj) => {
    const savedEmail = await AsyncStorage.getItem('key_email');
    if (obj.email === savedEmail) {
      navigation.navigate('Home');
    } else {
      Alert.alert(
        'Deseja fazer login?',
        'Caso já esteja logado com outra conta, você será deslogado imediatamente.',
        [
          { text: 'Não', style: 'cancel' },
          { text: 'Sim', onPress: () => handleLogin() }
        ]
      );
    }
  };

  // Async functions
  const fetchData = async () => {
    try {
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const allUsersData = snapshot.val();
        const allUsersArray = Object.values(allUsersData);

        setAllUsers(allUsersArray);
      } else {
        console.log('Nenhum usuário encontrado');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getLoggedUser = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('key_email');
      setEmail(savedEmail);
    } catch (error) {
      console.error('Error fetching data from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    fetchData();
    getLoggedUser();
  }, [, auth]);

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        {allUsers.map((user, index) => (
          <TouchableOpacity
            key={index}
            style={styles.userBox}
            onPress={() => handleGoHome(user)}
          >
            <View
              style={[styles.statusIndicator, { backgroundColor: user.email === email ? '#55CE63' : '#FFBC34' }]}
            />

            <Text style={styles.userName}>{user.nome}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.lastLogin}>Último Login: {user.lastlogin}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.newUserBox} onPress={handleNewuser}>
          <View>
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
    paddingHorizontal: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  userBox: {
    width: '90%',
    height: 120,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'left',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 10,
  },
  newUserBox: {
    width: '90%',
    height: 120,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'gray',
    borderStyle: 'dashed',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  statusIndicator: {
    position: 'absolute',
    top: 10,
    right: 15,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    transition: 'background-color 0.3s ease-in-out',
    transform: [{ scale: 1 }],
    overflow: 'hidden',
  },
  userInfo: {
    marginBottom: 5,
  },
  plus: {
    fontSize: 40,
    color: 'gray',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 15,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 15,
  },
  lastLogin: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 15,
  },
});


export default Login;
