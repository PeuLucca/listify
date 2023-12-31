import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const ListItem = (props) => {
  const { data, onSelectedToggle, onDeletedToggle, onNewProductToggle } = props;
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleItemSelection = (itemId) => {
    setSelectedItems((prevSelectedItems) => {
      const isAlreadySelected = prevSelectedItems.includes(itemId);
      const updatedSelectedItems = isAlreadySelected
        ? prevSelectedItems.filter((item) => item !== itemId)
        : [...prevSelectedItems, itemId];

      onSelectedToggle(itemId, isAlreadySelected);
      return updatedSelectedItems;
    });
  };

  const renderItem = ({ item, index }) => {
    const isItemSelected = selectedItems.includes(item.id);

    const borderBottomStyle =
      index === data.length - 1 ? { borderBottomWidth: 0 } : {};

    return (
      <TouchableOpacity
        style={[styles.itemContainer, borderBottomStyle]}
        onPress={() => toggleItemSelection(item.id)}
        onLongPress={() => onDeletedToggle(item.id)}
      >
        <View style={styles.itemContent}>
          <Text style={isItemSelected ? styles.itemNameSelected : styles.itemName}>
            {item.name}
          </Text>
        </View>
        <View style={styles.itemDetails}>
          <Text style={isItemSelected ? styles.itemPriceSelected : styles.itemPrice}>
            R$ {item.price}
          </Text>
          <FontAwesome5
            name={isItemSelected ? 'dot-circle' : 'circle'}
            size={22}
            color="#888"
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
    />
  );
};

export default ListItem;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 15,
  },
  itemNameSelected: {
    fontSize: 15,
    textDecorationLine: 'line-through',
    color: '#888',
  },
  itemPrice: {
    fontSize: 14,
    marginRight: 10,
  },
  itemPriceSelected: {
    fontSize: 14,
    marginRight: 10,
    textDecorationLine: 'line-through',
    color: '#888',
  },
});
