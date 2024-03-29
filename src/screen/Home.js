// Core
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  LogBox,
  Text,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Icons
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

// Components
import CardList from '../components/CardList';

// Firebase
import { signOut } from 'firebase/auth';
import { ref, get, remove } from 'firebase/database';

// Firebase Config
import { database, auth } from "../../firebaseConfig";

// Async Storage
import AsyncStorage from '@react-native-community/async-storage';

LogBox.ignoreAllLogs();

const Home = ({ isUserlogged }) => {
  const [userId, setUserId] = useState("");
  const [allListsObj, setAllListsObj] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const navigation = useNavigation();

  const signUserOff = async () => {
    try {
      await signOut(auth);
      AsyncStorage.removeItem('key_user_uid');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const fetchUser = async () => {
    const email = await AsyncStorage.getItem('key_email');
    if(!email){
      signUserOff();
    }
  };

  const handleGoItemList = (list) => {
    const id = list.id;
    navigation.navigate('Lista', { state: { id } });
  };

  const handleDeleteList = (product) => {
    Alert.alert(
      'Atenção!', 'Tem certeza que deseja deletar esta lista?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {text: 'Sim', onPress: () => deleteList(product)},
      ],
      { cancelable: false }
    )
  };

  const getAllLists = async () => {
    try {
      const currentUserId = await AsyncStorage.getItem('key_user_uid');
      setUserId(currentUserId);
      setLoading(true);
      const usersRef = ref(database, `lists/${currentUserId}`);
      const snapshot = await get(usersRef);
  
      if (snapshot.exists()) {
        const allListsData = snapshot.val();
        const novoArray = [];
  
        // Iterar sobre cada lista
        for (const [id, informacoesDoItem] of Object.entries(allListsData)) {
          let percentage = 0;
  
          if (informacoesDoItem.produtos) {
            let produtos = informacoesDoItem.produtos;
            let percentageArray = [];
  
            // Loop para percorrer cada produto
            for (let i = 0; i < produtos.length; i++) {
              percentageArray.push(produtos[i].status);
            }
  
            let totalItems = percentageArray.length;
            let trueCount = percentageArray.filter((item) => item === true).length;
  
            if (totalItems > 0) {
              percentage = trueCount / totalItems;
            }
          }
  
          const novoObjeto = {
            id: id,
            data: informacoesDoItem.data,
            nome: informacoesDoItem.nome,
            produtos: informacoesDoItem.produtos,
            percentage: percentage,
          };
  
          novoArray.push(novoObjeto);
        }
  
        novoArray.sort((a, b) => a.nome.localeCompare(b.nome));
  
        setAllListsObj(novoArray);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteList = async (product) => {
    try {
      setDeleting(true);
      const dataRef = ref(database, `lists/${userId}/${product.id}`);
      await remove(dataRef);

      setAllListsObj((prevLists) => prevLists.filter(item => item.id !== product.id));
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    getAllLists();
  }, [])

  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      getAllLists();
      fetchUser();
    });

    return () => {
      focusListener();
    };
  }, [navigation]);

  useEffect(() => {
    fetchUser();
  }, [, isUserlogged]);

  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          {
            loading ? (
              <ActivityIndicator style={{ marginTop: '70%' }} size="large" color="black" />
            ) :
            allListsObj.length !== 0 ? (
              allListsObj.map((item) => (
                <CardList
                  key={item.id}
                  id={item.id}
                  name={item.nome}
                  list={item.produtos}
                  dataText={item.data}
                  percentage={item.percentage}
                  handleGoItemList={() => handleGoItemList(item)}
                  handleDeleteList={() => handleDeleteList(item)}
                />
              ))
            ): <Text style={{ fontSize: 15, textAlign: 'center', marginTop: '70%' }}>Nenhuma lista encontrada</Text>
          }
        </ScrollView>

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
            onPress={() => navigation.navigate("Novo Produto")}
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
