// Core
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
  ActivityIndicator
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
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
        'Se já estiver autenticado com outra conta, você será desconectado.',
        [
          { text: 'Não', style: 'cancel' },
          { text: 'Sim', onPress: () => handleLogin() }
        ]
      );
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  // Async functions
  const fetchData = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
    getLoggedUser();
    fetchData();
  }, [auth]);

  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      getLoggedUser();
      fetchData();
    });

    return () => {
      focusListener();
    };
  }, [navigation]);

  return (
    <ScrollView>
      <View style={styles.container}>
          {
          loading ? (
            <ActivityIndicator style={{ marginBottom: 20 }} size="large" color="black" />
            ) : allUsers.map((user, index) => (
            <TouchableOpacity
              key={index}
              style={styles.userBox}
              onPress={() => handleGoHome(user)}
            >
              <View
                style={[styles.statusIndicator, { backgroundColor: user.email !== email ? '#FFBC34' : '#55CE63' }]}
              />

              <Text style={styles.userName}>{truncateText(user.nome, 17)}</Text>
              <Text style={styles.userEmail}>{truncateText(user.email, 21)}</Text>
              <Text style={styles.lastLogin}>Último Login: {user.lastlogin}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.newUserBox} onPress={handleNewuser}>
            <View>
              <Text style={styles.plus}>+</Text>
            </View>
            <Text style={{ fontSize: 15, color: "gray" }}>Novo usuário</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 50
  },
  userBox: {
    width: '80%',
    height: 120,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'black',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 25,
    justifyContent: 'center',
    alignItems: 'left',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 15,
  },
  newUserBox: {
    width: '80%',
    height: 120,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: 'gray',
    borderStyle: 'dashed',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  statusIndicator: {
    position: 'absolute',
    top: 25,
    right: 25,
    width: 15,
    height: 15,
    borderRadius: 10,
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
