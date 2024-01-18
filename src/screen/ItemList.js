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
  ScrollView,
} from 'react-native';

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
  remove,
  update
} from 'firebase/database';

// Firebase Config
import { database } from "../../firebaseConfig";

const ItemList = ({ route }) => {
    const { id } = route.params?.state || {};
    const [modal, setModal] = useState(false);
    const [newProduct, setNewProduct] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [loadingListName, setLoadingListName] = useState(false);
    const [itemSelected, setItemSelected] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [precoTotalList, setPrecoTotalList] = useState([]);
    const [precoTotal, setPrecoTotal] = useState(0);

    // New product
    const [newItemSelected, setNewItemSelected] = useState([]);
    const [newSelectedProducts, setNewSelectedProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);

    // Form
    const [listId, setListId] = useState(id);
    const [userId, setUserId] = useState("");
    const [listName, setListName] = useState("");
    const [orcamento, setOrcamento] = useState("");
    const [total, setTotal] = useState("0");
    const [produtos, setProdutos] = useState([]);

    // Handle Functions
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };
    
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const formatarPreco = (valor) => {
      const valorFormatado = valor.toString().replace(',', '.');
      const valorNumerico = parseFloat(valorFormatado);

      if (!isNaN(valorNumerico)) {
        const valorFinal = valorNumerico.toFixed(2);
        return valorFinal.replace('.', ',');
      } else {
        return valorFormatado;
      }
    };

    const renderNewProductItem = ({ item, index }) => {
      const isSelected = newItemSelected.includes(item.id);
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
              style={styles.productList}
              onPress={() => handleNewProductClick(item)}
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

    const handleNewProductClick = (item) => {
      const updatedSelection = [...newItemSelected];
      const updatedItemSelected = [...newSelectedProducts];

      if (updatedSelection.includes(item.id)) {
        updatedSelection.splice(updatedSelection.indexOf(item.id), 1);
        updatedItemSelected.splice(updatedSelection.indexOf(item.id), 1);
      } else {
        updatedSelection.push(item.id);
        updatedItemSelected.push({ id: item.id, status: false });
      }

      setNewItemSelected(updatedSelection);
      setNewSelectedProducts(updatedItemSelected);
    };

    const renderProductItem = ({ item, index }) => {
        const isFirstItem = index === 0 || (index > 0 && produtos[index - 1].categoria !== item.categoria);
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
                style={styles.productList}
                onPress={() => handleProductClick(item, index)}
                onLongPress={() => handleDeleteProduct(item.id)}
              >
                <View style={{ width: '70%' }}>
                  <Text
                    style={
                      [styles.item,
                          {
                            textDecorationLine: itemSelected.includes(index) ? 'line-through' : null 
                          }
                      ]}
                  >
                    {capitalizeFirstLetter(item.nome)} (R$ {formatarPreco(item.preco)})
                  </Text>
                </View>
                <FontAwesome5
                  name={itemSelected.includes(index) ? 'dot-circle' : 'circle'}
                  size={22}
                  color="#888"
                />
              </TouchableOpacity>
            </>
        );
    };

    const handleProductClick = (item, index) => {
      const updatedSelection = [...itemSelected];
      const updatedSelectedProducts = [...selectedProducts];
    
      // Verifica se o item já está selecionado
      if (updatedSelection.includes(index)) {
        // Remove o item da seleção
        updatedSelection.splice(updatedSelection.indexOf(index), 1);
    
        // Busca o item correspondente no array atualizado
        const correspondingItemIndex = updatedSelectedProducts.findIndex((selectedItem) => selectedItem.id === item.id);
    
        if (correspondingItemIndex !== -1) {
          updatedSelectedProducts.splice(correspondingItemIndex, 1);
        }
    
        // Atualiza o status para false
        item.status = false;
      } else {
        // Adiciona o item à seleção
        updatedSelection.push(index);
    
        // Busca o item correspondente no array atualizado
        const correspondingItem = updatedSelectedProducts.find((selectedItem) => selectedItem.id === item.id);
    
        if (!correspondingItem) {
          updatedSelectedProducts.push(item);
        }
    
        // Atualiza o status para true
        item.status = true;
      }
    
      setItemSelected(updatedSelection);
      setSelectedProducts(updatedSelectedProducts);
    
      updateListProduct(updatedSelectedProducts);

      updateTotal(updatedSelectedProducts);
    };

    const updateTotal = (updatedSelectedProducts) => {
      const updatedTotal = updatedSelectedProducts.reduce((total, product) => total + parseFloat(product.preco), 0);
      setTotal(updatedTotal);
    };

    const renderFooter = () => (
      <TouchableOpacity onPress={() => setNewProduct(true)}>
        <View style={styles.addMore}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '400',
              color: 'gray',
              textAlign: 'center'
            }}
          >
            + Adicionar produto
          </Text>
        </View>
      </TouchableOpacity>
    );   

    const handleDeleteProduct = (productId) => {
      Alert.alert(
        'Atenção!', 'Tem certeza que deseja remover este item?',
        [
          {text: 'Cancelar', style: 'cancel'},
          {text: 'Sim', onPress: () => deleteProduct(productId)},
        ],
        { cancelable: false }
      )
    };

    // Firebase Functions
    const getListData = async () => {
      try {
        setLoading(true);
        const currentUserId = await AsyncStorage.getItem('key_user_uid');
        setUserId(currentUserId);
    
        const usersRef = ref(database, `lists/${currentUserId}/${listId}`);
        const snapshot = await get(usersRef);
    
        if (snapshot.exists()) {
          const allProductsData = snapshot.val();
          const allProductsArray = Object.values(allProductsData);
    
          setListName(allProductsArray[1]);
          setOrcamento(allProductsArray[2]);
    
          const productStatus = allProductsArray[3].map(product => product.status);
          const productIds = allProductsArray[3].map(product => product.id);
    
          const productsData = await get(ref(database, `product/${currentUserId}`));
    
          const updatedSelection = [];
          const updatedSelectedProducts = [];
          const productList = productIds.map((productId, index) => {
            const productData = productsData.val()[productId];
            if (productStatus[index]) {
              updatedSelection.push(index);
              updatedSelectedProducts.push({
                id: productId,
                status: productStatus[index],
                ...productData
              });
            }
            return {
              id: productId,
              status: productStatus[index],
              ...productData
            };
          });

          setItemSelected(updatedSelection);
          setSelectedProducts(updatedSelectedProducts);
          setProdutos(productList);
          setIsUpdated(true);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };    

    const getProductData = async () => {
      try {
        setLoading(true);
        const usersRef = ref(database, `product/${userId}`);
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
    
          // Filter out products that are already in produtos
          const filteredProducts = allProductsArray.filter(product => !produtos.find(p => p.id === product.id));
    
          // Sort the remaining products by category and then by name
          filteredProducts.sort((a, b) => {
            const categoriaA = a.categoria.toLowerCase();
            const categoriaB = b.categoria.toLowerCase();
            if (categoriaA < categoriaB) return -1;
            if (categoriaA > categoriaB) return 1;
    
            const nomeA = a.nome.toLowerCase();
            const nomeB = b.nome.toLowerCase();
            return nomeA.localeCompare(nomeB);
          });
    
          setAllProducts(filteredProducts);
        } else {
          console.log('Nenhum produto encontrado');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };    

    const handleUpdate = async () => {
        try{
            setLoading(true);
            const dataRef = ref(database, `lists/${userId}/${listId}`);

            const listData = {
                nome: listName,
                orcamento: !orcamento ? "" : orcamento
            };
            await update(dataRef, listData);
            setModal(false);
        }catch(error){
            console.log(error);
        }finally{
            setLoading(false);
        }
    };
    
    const handleUpdateList = async () => {
      try {
        setLoading(true);
        const dataRef = ref(database, `lists/${userId}/${listId}`);
        const currentData = await get(dataRef);
        const currentList = currentData.val();
    
        const existingProducts = currentList.produtos || [];
    
        // Fetch details for new items from the product database
        const newProductsDetailsPromises = newSelectedProducts.map(async (item) => {
          const productRef = ref(database, `product/${userId}/${item.id}`);
          const productSnapshot = await get(productRef);
          const productData = productSnapshot.val();
          return {
            ...item,
            nome: productData.nome,
            categoria: productData.categoria,
          };
        });
    
        // Combine existing products and new selected products
        const combinedProducts = [...existingProducts, ...(await Promise.all(newProductsDetailsPromises))];
    
        // Sort the products alphabetically by categoria and then by nome
        const sortedProdutos = combinedProducts.sort((a, b) => {
          if (a.categoria === b.categoria) {
            return a.nome.localeCompare(b.nome);
          }
          return a.categoria.localeCompare(b.categoria);
        });
    
        const updatedList = {
          produtos: sortedProdutos,
        };
    
        await update(dataRef, updatedList);
    
        // Reset state variables
        setItemSelected([]);
        setSelectedProducts([]);
        getListData();
        setNewProduct(false);
        setNewSelectedProducts([]);
        setNewItemSelected([]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
        setIsUpdated(true);
      }
    };    

    const updateListProduct = async (productList) => {
      try {
        const dataRef = ref(database, `lists/${userId}/${listId}`);
        const currentData = await get(dataRef);
        const currentList = currentData.val();
    
        // Atualizar o status dos produtos na lista atual com base na lista atualizada
        currentList.produtos.forEach((product) => {
          const updatedProduct = productList.find((updatedItem) => updatedItem.id === product.id);
    
          // If updatedProduct is not found, set status to false
          product.status = updatedProduct ? updatedProduct.status : false;
        });

        await update(dataRef, { produtos: currentList.produtos });
      } catch (error) {
        console.error(error);
      }
    };

    const deleteProduct = async (productId) => {
      try {
        setLoading(true);
        const dataRef = ref(database, `lists/${userId}/${listId}`);
        const currentData = await get(dataRef);
        const currentList = currentData.val();
        const listProducts = currentList.produtos;

        const indexToRemove = listProducts.findIndex(product => product.id === productId);

        if (indexToRemove !== -1) {
          currentList.produtos.splice(indexToRemove, 1);
          await set(dataRef, currentList);
          setIsUpdated(true);
          
          setItemSelected([]);
          setSelectedProducts([]);
          getListData();
        }
      } catch (e) {
        console.error(e);
      }finally{
        setLoading(false);
      }
    };

    useEffect(() => {
        getListData();
        updateTotal(selectedProducts);
    }, [, isUpdated])

    useEffect(() => {
      getProductData();
    }, [isUpdated, newProduct])

    return (
        <View style={styles.container}>

            <View style={styles.infoList}>
                <View style={styles.row}>
                    {loadingListName ? (
                        <ActivityIndicator size="large" color="black" />
                    ) : (
                        <>
                            <View>
                                <Text style={styles.name}>
                                    {listName ? capitalizeFirstLetter(truncateText(listName, 19)) : "Nova lista"}
                                </Text>
                                <Text style={[styles.precos, { color: '#8B8000' }]}>
                                    Orçamento <Text>R$ {!orcamento ? "00.00" : formatarPreco(orcamento)}</Text>
                                </Text>
                                <Text
                                    style={[styles.precos, {
                                        color: total > orcamento ? 'red' : 'green',
                                        textDecorationLine: 'underline',
                                        fontWeight: '500'
                                    }]}
                                >
                                    Total <Text>R$ {formatarPreco(total)}</Text>
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => setModal(true)}>
                                <AntDesign name="edit" style={styles.icon} />
                            </TouchableOpacity>
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
                            data={produtos}
                            renderItem={renderProductItem}
                            ListFooterComponent={renderFooter}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                        />
                    )
                }
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modal}
                onRequestClose={() => setModal(false)}
            >
                <View style={styles.overlay} />
                    <View style={styles.centeredView}>
                        {
                            loading
                            ? <ActivityIndicator size="large" color="black" />
                            : (
                                <View style={styles.modalView}>
                                    <Text style={styles.modalTitle}>Preencha os campos abaixo:</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nome da lista"
                                        value={listName}
                                        onChangeText={(text) => setListName(text)}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Orçamento"
                                        keyboardType="numeric"
                                        value={orcamento}
                                        onChangeText={(text) => setOrcamento(text)}
                                    />
                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity style={[styles.button, styles.buttonSave]} onPress={handleUpdate}>
                                            <Text style={styles.buttonText}>
                                                Atualizar
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={() => setModal(false)}>
                                            <Text style={styles.buttonText}>Cancelar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }
                    </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={newProduct}
                onRequestClose={() => setNewProduct(false)}
            >
                <View style={styles.overlay} />
                    <View style={styles.centeredView}>
                        {
                            loading
                            ? <ActivityIndicator size="large" color="black" />
                            : (
                                <View style={[styles.modalView, { alignItems: 'stretch' }]}>
                                    <Text style={styles.modalTitle}>Adicionar produtos:</Text>
                                    <FlatList
                                      style={{ height: '40%' }}
                                        data={allProducts}
                                        renderItem={renderNewProductItem}
                                        keyExtractor={(item) => item.id} 
                                        showsVerticalScrollIndicator={false}
                                    />
                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity
                                          style={[styles.button, styles.buttonSave]}
                                          onPress={handleUpdateList}
                                        >
                                            <Text style={styles.buttonText}>
                                                Atualizar
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                          style={[styles.button, styles.buttonCancel]}
                                          onPress={() => setNewProduct(false)}
                                        >
                                            <Text style={styles.buttonText}>Cancelar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }
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
  item: {
    fontSize: 16,
    fontWeight: '400',
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
  },
  precos: {
    fontSize: 16.5,
    fontWeight: '400',
    marginTop: 2
  },
  icon: {
    fontSize: 23,
  },
  date: {
    fontSize: 15,
    fontWeight: '400',
    color: '#222',
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

export default ItemList;
