// Core
import React, { useState } from "react";
import {
    View,
    TextInput,
    StyleSheet,
} from 'react-native';

// Components
import ListItem from "../components/ListItem";
import Select from "../components/Select";

const NewList = () => {
    const [newProduto, setNewProduto] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [isNewProduct, setIsNewProduct] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const options = [
        {
            item: 'Arsenal FC',
            id: 'ARS',
        },
        {
            item: 'Barcelona',
            id: 'BR',
        },
        {
            item: 'Chelsea FC',
            id: 'CHE',
        },
        {
            item: 'Everton FC',
            id: 'EVE',
        },
        {
            item: 'FC Bayern Munich',
            id: 'FBM',
        },
        {
            item: 'Juventus',
            id: 'JUVE',
        },
        {
            item: 'Liverpool FC',
            id: 'LIV',
        },
        {
            item: 'Leicester City FC',
            id: 'LEI',
        },
        {
            item: 'Manchester United FC',
            id: 'MUN',
        },
        {
            item: 'Manchester City FC',
            id: 'MCI',
        },
        {
            item: 'PSG',
            id: 'PSG',
        },
        {
          item: 'Real Madrid',
          id: 'RM',
        },
        {
          item: 'Tottenham Hotspur FC',
          id: 'TOT',
        },
    ];

    function onChange() {
      return (val) => setSelectedItem(val)
    };
  
    return (
        <View>
            <Select
                options={options}
                placeholder="Selecionar Produto"
                searchPlaceholder="Pesquisar produto"
                onChange={onChange()}
                value={selectedItem}
            />
            <View>
                {
                    isNewProduct && (
                        <View style={styles.container}>
                            <TextInput
                                style={styles.input}
                                placeholder="Novo Produto"
                                onChangeText={(text) => setNewProduto(text)}
                                value={newProduto}
                            />
                            <TextInput
                                style={styles.priceInput}
                                placeholder="R$ Preço"
                                keyboardType="numeric"
                                onChangeText={(text) => setNewPrice(text)}
                                value={newPrice}
                            />
                        </View>
                    )
                }
            </View>
        </View>
    );
};

export default NewList;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 20,
        borderWidth: 1,
        borderColor: 'black',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },
    input: {
        width: "70%",
        fontSize: 15,
        padding: 9,
        paddingLeft: 20,
        marginRight: 10,
    },
    priceInput: {
        borderLeftWidth: 1,
        borderColor: 'black',
        fontSize: 15,
        padding: 9,
        paddingLeft: 20,
        flex: 1,
    },
});
