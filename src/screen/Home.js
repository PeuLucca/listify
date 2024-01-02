// Core
import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView, LogBox } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Icons
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

// Components
import CardList from '../components/CardList';

// Mock
import { list } from '../mock';

// Firebase
import { signOut } from 'firebase/auth';

// Firebase Config
import { auth } from "../../firebaseConfig";

// Async Storage
import AsyncStorage from '@react-native-community/async-storage';

LogBox.ignoreAllLogs();

const Home = ({ isUserlogged }) => {
  const navigation = useNavigation();

  const signUserOff = async () => {
    try {
      await signOut(auth);
      AsyncStorage.removeItem('key_email');
      AsyncStorage.removeItem('key_user_uid');

      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    console.log(isUserlogged.logged);
    if(!isUserlogged.logged && !isUserlogged.newUser){
      signUserOff();
    }
  }, [isUserlogged])

  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          {list.map((item) => (
            <CardList
              key={item.id}
              id={item.id}
              name={item.name}
              list={item.list}
              purchasePlace={item.purchasePlace}
              percentage={item.percentage}
            />
          ))}
        </ScrollView>

        {/* Action Button */}
        <ActionButton buttonColor="#004E00">
          <ActionButton.Item
            buttonColor="#9b59b6"
            title="Criar lista"
            onPress={() => navigation.navigate("Nova Lista")}
          >
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#3498db"
            title="Criar produto"
            onPress={() => {}}
          >
            <Icon name="md-cart" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 30,
    padding: 10,
  },
  scrollViewContainer: {
    paddingVertical: 10,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

export default Home;
