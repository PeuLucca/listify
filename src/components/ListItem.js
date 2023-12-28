// Core
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  StatusBar,
} from 'react-native';

const ListItem = () => {
    const DATA = [
        {
          title: 'Main dishes',
          data: ['Pizza', 'Burger', 'Risotto'],
        },
        {
          title: 'Sides',
          data: ['French Fries', 'Onion Rings', 'Fried Shrimps'],
        },
        {
          title: 'Drinks',
          data: ['Water', 'Coke', 'Beer'],
        },
        {
          title: 'Desserts',
          data: ['Cheese Cake', 'Ice Cream'],
        },
    ];

    return(
        <SafeAreaView style={styles.container}>
            <SectionList
            sections={DATA}
            keyExtractor={(item, index) => item + index}
            renderItem={({item}) => (
                <View style={styles.item}>
                    <Text style={styles.title}>{item}</Text>
                </View>
            )}
            renderSectionHeader={({section: {title}}) => (
                <Text style={styles.header}>{title}</Text>
            )}
            />
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
      marginHorizontal: 16,
    },
    item: {
      backgroundColor: 'red',
      padding: 20,
      marginVertical: 8,
    },
    header: {
      fontSize: 32,
      backgroundColor: 'black',
      color: 'white'
    },
    title: {
      fontSize: 24,
    },
  });

export default ListItem;