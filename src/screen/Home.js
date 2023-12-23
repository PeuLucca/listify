// Core
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, ImageBackground } from 'react-native';
import { useNavigation  } from '@react-navigation/native';

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

// This line is used to prevent yellow errors caused by Firebase in the application.
console.disableYellowBox = true;

const Home = ({ isUserlogged }) => {
  const navigation = useNavigation();
  const backgroundImage = { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhapcw-vU9Nt5hF39XiTpNlvv9R-UpSDLy7r_uqWmW_v76NUQ-W2ZGkpjDy_sCrzFHY_M&usqp=CAU' };

  const signUserOff = async () => {
    try {
      await signOut(auth);
      AsyncStorage.removeItem('key_email');
      AsyncStorage.removeItem('key_senha');
      AsyncStorage.removeItem('key_lastLogin');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    if(!isUserlogged){
      signUserOff();
    }
  }, [isUserlogged])

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
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
            title="Nova lista"
            onPress={() => console.log("notes tapped!")}
          >
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#3498db"
            title="Cadastrar produto"
            onPress={() => {}}
          >
            <Icon name="md-cart" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    </ImageBackground>
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
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgray',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

export default Home;
