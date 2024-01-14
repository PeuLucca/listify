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

const ItemList = ({ route }) => {
    const { id } = route.params?.state || {};
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingListName, setLoadingListName] = useState(false);
    const [itemSelected, setItemSelected] = useState([]);

    // Form
    const [listId, setListId] = useState(id);
    const [userId, setUserId] = useState("");
    const [listName, setListName] = useState("");
    const [orcamento, setOrcamento] = useState("");
    const [total, setTotal] = useState("00");
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

        const valorFinal = Number.isInteger(parseFloat(valorFormatado))
          ? `${valorFormatado}.00`
          : valorFormatado;
      
        return valorFinal;
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
              >
                <View style={{ width: '50%' }}>
                  <Text
                    style={
                        [styles.item,
                            {
                                textDecorationLine: itemSelected.includes(index) ? 'line-through' : null 
                            }
                        ]}
                    >
                    {capitalizeFirstLetter(item.nome)}
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
    
        if (updatedSelection.includes(index)) {
          updatedSelection.splice(updatedSelection.indexOf(index), 1);
        } else {
          updatedSelection.push(index);
        }
    
        setItemSelected(updatedSelection);
    };

    // Firebase Functions
    const getListData = async () => {
        try {
            const currentUserId = await AsyncStorage.getItem('key_user_uid');
            setUserId(currentUserId);
            setLoading(true);
    
            const usersRef = ref(database, `lists/${currentUserId}/${listId}`);
            const snapshot = await get(usersRef);
    
            if (snapshot.exists()) {
                const allProductsData = snapshot.val();
                const allProductsArray = Object.values(allProductsData);
    
                setListName(allProductsArray[1]);
                setOrcamento(allProductsArray[2]);
    
                // Fetch product details for each product ID in the list
                const productStatus = allProductsArray[3].map(product => product.status);

                const productIds = allProductsArray[3].map(product => product.id);
                const productsData = await get(ref(database, `product/${currentUserId}`));
    
                const updatedSelection = [];
                const productList = productIds.map((productId, index) => {
                    const productData = productsData.val()[productId];
                    if (productStatus[index]) {
                        updatedSelection.push(index);
                    }
                    return {
                        id: productId,
                        status: productStatus[index],
                        ...productData
                    };
                });
    
                setItemSelected(updatedSelection);
                setProdutos(productList);
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

    useEffect(() => {
        getListData();
    }, [])

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
                                        color: 'green',
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
