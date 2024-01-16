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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from "@react-native-picker/picker"

// Expo
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

// Async Storage
import AsyncStorage from '@react-native-community/async-storage';

// Firebase
import {
  ref,
  get,
  set,
  push,
  update
} from 'firebase/database';

// Firebase Config
import { database } from "../../firebaseConfig";

const NewList = () => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState("");
  const [listObj, setListObj] = useState(null);
  const [modalName, setModalName] = useState(false);
  const [modalProduct, setModalProduct] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [itemSelected, setItemSelected] = useState([]);
  const [selectedListItem, setSelectedListItem] = useState([]);

  const [isUpdate, setIsUpdate] = useState(false);
  const [isUpdateList, setIsUpdateList] = useState(false);
  const [updateObj, setUpdateObj] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingListName, setLoadingListName] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  // Form
  const [listName, setListName] = useState("");
  const [date, setDate] = useState("");
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [localCompra, setLocalCompra] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Handle functions
  const handleSaveListName = () => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

    if (listName === "") {
      setListName("Nova lista");
    }
    setDate(formattedDate);

    if(isUpdateList){
      updateNodeList();
    }else{
      createNodeList(formattedDate);
      setIsUpdateList(true);
    }

    setModalName(false);
  };

  const getUserData = async () => {
    const currentUserId = await AsyncStorage.getItem('key_user_uid');
    setUserId(currentUserId);
  };

  const getProductData = async () => {
    try {
      setLoading(true);
      const usersRef = ref(database, 'product');
      const snapshot = await get(usersRef);
  
      if (snapshot.exists()) {
        const allProductsArray = [];
  
        snapshot.forEach((categoriaSnapshot) => {
          const produtos = categoriaSnapshot.val();
  
          for (const productId in produtos) {
            const product = produtos[productId];
            allProductsArray.push({
              nome: product.nome,
              categoria: product.categoria,
              preco: product.preco,
              local: product.local,
              id: productId
            });
          }
        });
  
        // Ordenar por categoria e, em seguida, por nome
        allProductsArray.sort((a, b) => {
          // Organizar por categoria
          const categoriaA = a.categoria.toLowerCase();
          const categoriaB = b.categoria.toLowerCase();
          if (categoriaA < categoriaB) return -1;
          if (categoriaA > categoriaB) return 1;
  
          // Se as categorias forem iguais, organizar por nome
          const nomeA = a.nome.toLowerCase();
          const nomeB = b.nome.toLowerCase();
          return nomeA.localeCompare(nomeB);
        });
  
        setAllProducts(allProductsArray);
      } else {
        console.log('Nenhum produto encontrado');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleCloseModal = () => {
    setModalProduct(false);
    setNome("");
    setPreco("");
    setSelectedCategory("");
    setLocalCompra("");
    setUpdateObj(null);
    setIsUpdate(false);
  };

  const renderProductItem = ({ item, index }) => {
    const isSelected = itemSelected.includes(item.id);
    const isLastItem = index === allProducts.length - 1;
  
    // Verifica se é o primeiro item da categoria
    const isFirstItem = index === 0 || (index > 0 && allProducts[index - 1].categoria !== item.categoria);

    let backgroundColor;

    switch (item.categoria.toLowerCase()) {
      case 'alimentos':
        backgroundColor = 'lightcoral';
        break;
      case 'limpeza':
        backgroundColor = 'lightblue';
        break;
      case 'saude':
        backgroundColor = 'lightgreen';
        break;
      case 'beleza':
        backgroundColor = '#ad7dc9';
        break;
      case 'outros':
        backgroundColor = 'gold';
        break;
    }
  
    return (
      <>
        {isFirstItem && (
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginTop: 10,
            padding: 2,
            backgroundColor: backgroundColor,
            color: '#fff',
            width: '40%',
            borderTopLeftRadius: 3,
            borderBottomLeftRadius: 3,
            borderTopRightRadius: 15,
            borderBottomRightRadius: 15,
            textAlign: 'center'
          }}>{capitalizeFirstLetter(item.categoria)}</Text>
        )}
  
        <TouchableOpacity
          style={[styles.productList, isLastItem && styles.lastProductItem]}
          onPress={() => handleProductClick(item, index)}
          onLongPress={() => handleUpdate(item)}
        >
          <View style={{ width: '50%' }}>
            <Text style={styles.item}>
              {capitalizeFirstLetter(item.nome)}
            </Text>
          </View>
          <FontAwesome5
            name={isSelected ? 'dot-circle' : 'circle'}
            size={22}
            color="#888"
          />
        </TouchableOpacity>
      </>
    );
  };

  const handleProductClick = (item) => {
    const updatedSelection = [...itemSelected];
    const updatedItemSelected = [...selectedListItem];

    if (updatedSelection.includes(item.id)) {
      updatedSelection.splice(updatedSelection.indexOf(item.id), 1);
      updatedItemSelected.splice(updatedSelection.indexOf(item.id), 1);
    } else {
      updatedSelection.push(item.id);
      updatedItemSelected.push({ id: item.id, status: false });
    }

    setItemSelected(updatedSelection);
    setSelectedListItem(updatedItemSelected);
  };

  const handleUpdate = (item) => {
    setModalProduct(true);
    setNome(item.nome);
    setPreco(item.preco);
    setSelectedCategory(item.categoria)
    setLocalCompra(item.local);

    setUpdateObj(item);
    setIsUpdate(true);
  };

  const handleSaveProduct = () => {
    if(nome === "" || preco === "" || selectedCategory === ""){
      Alert.alert(
        'Atenção!',
        'Preencha os campos obrigatórios',
        [
          { text: 'OK' },
        ],
      );
    }else{
      if(isUpdate){
        updateProduct();
      }else{
        createNewProduct();
      }
      setModalProduct(false);
      setNome("");
      setPreco("");
      setSelectedCategory("");
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
      setLoadingListName(true);
      const dataRef = ref(database, `lists/${userId}`);

      // Gera um ID único para a lista
      const newListRef = push(dataRef);

      const listData = {
        produtos: [],
        nome: listName,
        data: formattedDate,
        orcamento: ""
      };

      setListObj({
        listId: newListRef,
        nome: listName,
        data: formattedDate,
        orcamento: ""
      })
      await set(newListRef, listData);
    }catch(e){
      console.error(e);
    }finally{
      setLoadingListName(false);
    }
  };

  const updateNodeList = async () => {
    try{
      setLoadingListName(true);
      const listString = `${listObj.listId}`;
      const listId = listString.split('/').pop();
      const dataRef = ref(database, `lists/${userId}/${listId}`);

      const listData = {
        nome: listName ? listName : "Nova lista",
      };
      await update(dataRef, listData);
    }catch(e){
      console.error(e);
    }finally{
      setLoadingListName(false);
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
        categoria: selectedCategory,
        local: localCompra ?? null
      };

      await set(newProductRef, productData);
    }catch(e){
      console.error(e);
    }
  };

  const updateProduct = async () => {
    try{
      const dataRef = ref(database, `product/${userId}/${updateObj.id}`);
      const updatedProductData = {
        nome: nome,
        preco: preco,
        categoria: selectedCategory,
        local: localCompra,
      };

      await update(dataRef, updatedProductData);
    }catch(e){
      console.error(e);
    }
  };

  const updateList = async () => {
    try{
      setLoadingCreate(true);
      if(isUpdateList){
        const listString = `${listObj.listId}`;
        const listId = listString.split('/').pop();
        const dataRef = ref(database, `lists/${userId}/${listId}`);
        const updatedList = {
          produtos: selectedListItem,
          nome: listObj.nome,
          data: listObj.data,
          orcamento: listObj.orcamento
        };
  
        await update(dataRef, updatedList);
        navigation.navigate('Home');
      }else{
        const dataRef = ref(database, `lists/${userId}`);
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

        // Gera um ID único para a lista
        const newListRef = push(dataRef);
  
        const listData = {
          produtos: selectedListItem,
          nome: "Nova lista",
          orcamento: "",
          data: formattedDate,
        };

        await set(newListRef, listData);
        navigation.navigate('Home');
      }
    }catch(error){
      console.error(error);
    }finally{
      setLoadingCreate(false);
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
          {loadingListName ? (
            <ActivityIndicator size="large" color="black" />
          ) : (
            <>
              <TouchableOpacity onPress={() => setModalName(true)}>
                <Text style={styles.name}>
                  {listName ? truncateText(listName, 19) : "Nova lista"}
                  <AntDesign name="edit" style={styles.icon} onPress={() => setModalName(true)} />
                </Text>
              </TouchableOpacity>
              <Text style={styles.date}>{date ? date : "data de criação"}</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.products}>
      {
          loading
          ? <ActivityIndicator style={{ marginBottom: 20 }} size="large" color="black" />
          : (
              <FlatList
                data={allProducts}
                renderItem={renderProductItem}
                ListFooterComponent={renderFooter}
                showsVerticalScrollIndicator={false}
              />
          )
        }
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={updateList}
      >
        <Text style={styles.saveButtonText}>
          {loadingCreate
            ? <ActivityIndicator style={{ marginLeft: 10 }} size="small" color="white" />
            : `Criar  `
          }
          {loadingCreate ? null : <FontAwesome5 name="save" style={{ color: 'white', fontSize: 17 }} />}
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
                            <Text style={styles.buttonText}>
                              {
                                isUpdateList ? "Atualizar" : "Salvar"
                              }
                            </Text>
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
        visible={modalProduct}
        onRequestClose={handleCloseModal}
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
            <View style={{
              borderWidth: 0.5,
              borderColor: 'black',
              borderRadius: 5,
              height: 52,
              width: '100%',
              marginBottom: '5%',
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 5,
              borderTopRightRadius: 5,
              borderTopLeftRadius: 10,
              }}
            >
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue) =>
                  setSelectedCategory(itemValue)
                }
              >
                <Picker.Item color="gray" label="Selecione a categoria" value="" />
                <Picker.Item label="Alimentos" value="alimentos" />
                <Picker.Item label="Produtos de Limpeza" value="limpeza" />
                <Picker.Item label="Beleza e Cuidados Pessoais" value="beleza" />
                <Picker.Item label="Saúde e Bem-Estar" value="saude" />
                <Picker.Item label="Outros" value="outros" />
              </Picker>
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
                <Text style={styles.buttonText}>
                  {
                    isUpdate ? "Atualizar" : "Salvar"
                  }
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={handleCloseModal}
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
    borderColor: 'lightgray',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  products: {
    backgroundColor: 'white',
    margin: '4%',
    height: '70%',
    marginBottom: 0,
    padding: 20,
    borderWidth: 0.5,
    borderColor: 'lightgray',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
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
    fontSize: 18,
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
  modalTitle: {
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    padding: 8,
    paddingLeft: 11,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 5,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 10,
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
    borderRadius: 15,
    marginTop: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
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
    margin: '25%',
    backgroundColor: '#9b59b6',
    padding: 8,
    borderBottomRightRadius: 3,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    marginTop: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default NewList;
