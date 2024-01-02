import React, { useState } from "react";
import { View, StyleSheet, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const NewList = ({ route }) => {
  const { type } = route.params;
  const [modalName, setModalName] = useState(false);
  const [listName, setListName] = useState("");
  const [date, setDate] = useState("");

  // Handle functions
  const handleSaveListName = () => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

    if (listName === "") {
      setListName("Nova lista");
    }
    setDate(formattedDate);
    setModalName(false);

    if(type === 'new'){
      // create List
    }else{
      // update List
    }
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Firebase functions

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
        <TouchableOpacity>
          <Text style={styles.budget}>
            Orçamento
            <AntDesign name="edit" style={styles.icon} />
          </Text>
        </TouchableOpacity>
      </View>

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
    fontSize: 17,
    padding: 8,
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
});

export default NewList;
