// Core
import React, { useState } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    Text,
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
    const data = [
        { id: '1', name: 'Item 1', price: '45,00' },
        { id: '2', name: 'Item 2', price: '5,99' },
        { id: '3', name: 'Item 3', price: '15,00' },
        { id: '4', name: 'Item 4', price: '25,00' },
    ];

    function onChange() {
      return (val) => setSelectedItem(val)
    };

    const handleItemToggle = (updatedSelectedItems, isAlreadySelected) => {
        // save the updated list here
        // set the remaining items
        console.log(`Updated Item ${updatedSelectedItems}`);
        console.log(`Is Checked: ${!isAlreadySelected}`);
    };
  
    return (
        <View>
            <View style={styles.infoList}>
                <View style={styles.row}>
                    <Text style={styles.name}>Lista semanal - Jaú...</Text>
                    <Text style={styles.data}>05/02/2024</Text>
                </View>
                <Text style={styles.orcamento}>Orçamento: R$50,00</Text>
                <View style={styles.rowTotal}>
                    <Text style={styles.total}>Total:</Text>
                    <Text style={styles.totalPreco}>R$25,50</Text>
                </View>
            </View>

            <View style={styles.list}>
                <ListItem data={data} onItemToggle={handleItemToggle} />
            </View>
        </View>
    );
};

export default NewList;

const styles = StyleSheet.create({
    infoList: {
        backgroundColor: 'white',
        margin: 25,
        padding: 20,
        borderWidth: 1,
        borderColor: 'black',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    list: {
        backgroundColor: 'white',
        margin: 25,
        padding: 20,
        borderWidth: 1,
        borderColor: 'black',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    rowTotal: {
        flexDirection: 'row',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
    },
    data: {
        fontSize: 15,
        fontWeight: '400',
        color: '#222',
    },
    orcamento: {
        fontSize: 17,
        fontWeight: '400',
        color: 'green',
    },
    total: {
        fontSize: 17,
        fontWeight: '400',
        color: '#222',
    },
    totalPreco: {
        marginLeft: 5,
        fontSize: 17,
        fontWeight: '400',
        color: '#222',
        textDecorationLine: 'underline'
    }
});
