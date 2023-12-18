// Core
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

// Component
import CardList from '../components/CardList';

// Mock
import { list } from '../mock';

const Home = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {list.map((item) => (
          <CardList
            id={item.id}
            name={item.name}
            list={item.list}
            purchasePlace={item.purchasePlace}
            percentage={item.percentage}
          />
        ))}
      </ScrollView>

      {/* Action Button */}
      <ActionButton buttonColor="#004E00">
        <ActionButton.Item
          buttonColor="#9b59b6"
          title="Nova lista"
          onPress={() => console.log("notes tapped!")}
        >
          <Icon name="md-create" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#3498db"
          title="Cadastrar produto"
          onPress={() => {}}
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
  },
  scrollViewContainer: {
    paddingVertical: 10,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgray',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

export default Home;
