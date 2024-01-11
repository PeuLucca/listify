// Core
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

// Async Storage
import AsyncStorage from '@react-native-community/async-storage';

// Firebase
import { ref, get, set, push } from 'firebase/database';

// Firebase Config
import { database } from "../../firebaseConfig";

const NewList = () => {
  const [userId, setUserId] = useState("");
  const [modalName, setModalName] = useState(false);
  const [modalBudget, setModalBudget] = useState(false);
  const [modalProduct, setModalProduct] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [itemSelected, setItemSelected] = useState([]);

  // Form
  const [listName, setListName] = useState("");
  const [orcamento, setOrcamento] = useState("");
  const [date, setDate] = useState("");
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [localCompra, setLocalCompra] = useState("");

  // Handle functions
  const handleSaveListName = () => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

    if (listName === "") {
      setListName("Nova lista");
    }
    setDate(formattedDate);
    setModalName(false);

    createNodeList(formattedDate);
  };

  const handleSaveBudget = () => {
    setModalBudget(false);
  };

  const getUserData = async () => {
    const currentUserId = await AsyncStorage.getItem('key_user_uid');
    setUserId(currentUserId);
  };

  const getProductData = async () => {
    try {
      const usersRef = ref(database, 'product');
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const allProductsData = snapshot.val();
        const allproducts = Object.values(allProductsData);

        const novoArray = [];

        for (const objeto of allproducts) {
          for (const chave in objeto) {
            const informacoesDoItem = objeto[chave];

            const novoObjeto = {
              id: chave,
              local: informacoesDoItem.local,
              nome: informacoesDoItem.nome,
              preco: informacoesDoItem.preco,
            };

            novoArray.push(novoObjeto);
          }
        }
        setAllProducts(novoArray);
      } else {
        console.log('Nenhum produto encontrado');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const renderProductItem = ({ item, index }) => {
    const isLastItem = index === allProducts.length - 1;
  
    return (
      <TouchableOpacity
        style={[styles.productList, isLastItem && styles.lastProductItem]}
        onPress={() => handleProductClick(index)}
      >
        <View style={{ width: '50%' }}>
          <Text style={styles.item}>
            {capitalizeFirstLetter(item.nome)}
          </Text>
        </View>
        <FontAwesome5
          name={itemSelected.includes(index) ? 'dot-circle' : 'circle'}
          size={22}
          color="#888"
        />
      </TouchableOpacity>
    );
  };

  const handleProductClick = (index) => {
    // Clone the existing array to avoid mutating state directly
    const updatedSelection = [...itemSelected];

    // Toggle the selection status of the clicked item
    if (updatedSelection.includes(index)) {
      // Item is selected, remove it from the selection array
      updatedSelection.splice(updatedSelection.indexOf(index), 1);
    } else {
      // Item is not selected, add it to the selection array
      updatedSelection.push(index);
    }

    // Update the state with the new selection array
    setItemSelected(updatedSelection);
  };

  const handleSaveProduct = () => {
    if(nome === "" || preco === ""){
      Alert.alert(
        'Atenção!',
        'Preencha os campos obrigatórios',
        [
          { text: 'OK' },
        ],
      );
    }else{
      createNewProduct();
      setModalProduct(false);
      setNome("");
      setPreco("");
      setLocalCompra("");
      getProductData();
    }
  };

  const renderFooter = () => (
    <TouchableOpacity onPress={() => setModalProduct(true)}>
      <View style={styles.addMore}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '400',
            color: 'gray',
            textAlign: 'center'
          }}
        >
          Criar novo produto...
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Firebase functions
  const createNodeList = async (formattedDate) => {
    try{
      const dataRef = ref(database, `lists/${userId}`);

      // Gera um ID único para a lista
      const newListRef = push(dataRef);

      const listData = {
        produtos: [],
        nome: listName,
        data: formattedDate,
        orcamento: ""
      };
      await set(newListRef, listData);
    }catch(e){
      console.error(e);
    }
  };

  const createNewProduct = async () => {
    try{
      const dataRef = ref(database, `product/${userId}`);

      // Gera um ID único para o produto
      const newProductRef = push(dataRef);

      const productData = {
        nome: nome,
        preco: preco,
        local: localCompra ?? null
      };
      await set(newProductRef, productData);
    }catch(e){
      console.error(e);
    }
  };

  useEffect(() => {
    getUserData();
    getProductData();
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.infoList}>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => setModalName(true)}>
            <Text style={styles.name}>
              {listName ? truncateText(listName, 19) : "Nova lista"}
              <AntDesign name="edit" style={styles.icon} onPress={() => setModalName(true)} />
            </Text>
          </TouchableOpacity>
          <Text style={styles.date}>{date ? date : "data de criação"}</Text>
        </View>
        {
          listName && (
            <TouchableOpacity onPress={() => setModalBudget(true)}>
              <Text style={styles.budget}>
                Orçamento: {orcamento ? `R$ ${orcamento}` : ""}
                <AntDesign name="edit" style={styles.icon} />
              </Text>
            </TouchableOpacity>
          )
        }
      </View>

      <View style={styles.products}>
        <FlatList
          data={allProducts}
          renderItem={renderProductItem}
          ListFooterComponent={renderFooter}
        />
      </View>

      <TouchableOpacity
        style={styles.saveButton}
      >
        <Text style={styles.saveButtonText}>
          Criar  <FontAwesome5 name="save" style={{ color: 'white', fontSize: 16 }} />
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalName}
        onRequestClose={() => setModalName(false)}
      >
        <View style={styles.overlay} />
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Preencha os campos abaixo:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome da lista"
                        value={listName}
                        onChangeText={(text) => setListName(text)}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, styles.buttonSave]} onPress={handleSaveListName}>
                            <Text style={styles.buttonText}>Salvar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={() => setModalName(false)}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
      </Modal>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalBudget}
        onRequestClose={() => setModalBudget(false)}
      >
        <View style={styles.overlay} />
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Preencha os campos abaixo:</Text>
            <TextInput
              style={styles.input}
              placeholder="R$"
              value={orcamento}
              onChangeText={(text) => setOrcamento(text)}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSave]}
                onPress={handleSaveBudget}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalBudget(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalProduct}
        onRequestClose={() => setModalProduct(false)}
      >
        <View style={styles.overlay} />
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Preencha os campos abaixo:</Text>
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                style={[styles.input, { flex: 2, marginRight: 5 }]}
                placeholder="Nome"
                value={nome}
                onChangeText={(text) => setNome(text)}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="R$"
                value={preco}
                onChangeText={(text) => setPreco(text)}
                keyboardType="numeric"
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Local de compra (não obrigatório)"
              value={localCompra}
              onChangeText={(text) => setLocalCompra(text)}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSave]}
                onPress={handleSaveProduct}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalProduct(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoList: {
    backgroundColor: 'white',
    margin: '4%',
    marginBottom: 0,
    padding: 20,
    borderWidth: 0.5,
    borderColor: 'black',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  selectedProducts: {
    backgroundColor: 'white',
    margin: '4%',
    marginBottom: 0,
    padding: 20,
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 8
  },
  productList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  addMore: {
    padding: 7,
    borderTopWidth: 0.8,
    borderTopColor: '#ccc',
  },
  lastProductItem: {
    padding: 10,
    borderBottomWidth: 0,
  },
  item: {
    fontSize: 16,
    fontWeight: '400',
  },
  products: {
    backgroundColor: 'white',
    margin: '4%',
    marginBottom: 0,
    padding: 20,
    borderWidth: 0.5,
    borderColor: 'black',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 9,
    elevation: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  name: {
    fontSize: 20,
    fontWeight: '500',
    color: '#222',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    marginLeft: 10,
  },
  date: {
    fontSize: 15,
    fontWeight: '400',
    color: '#222',
  },
  budget: {
    fontSize: 18,
    fontWeight: '400',
    color: 'green',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    padding: 8,
    paddingLeft: 11,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'black',
    backgroundColor: 'white',
    width: '100%',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    borderRadius: 5,
    padding: 8,
    elevation: 2,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSave: {
    backgroundColor: 'green',
  },
  buttonCancel: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
  saveButton: {
    margin: '20%',
    backgroundColor: '#9b59b6',
    padding: 8,
    borderBottomRightRadius: 3,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NewList;
