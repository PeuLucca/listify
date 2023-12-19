// Core
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import * as Animatable from 'react-native-animatable';
import { AntDesign } from '@expo/vector-icons';

const CardList = (props) => {
  const {
    id,
    name,
    list,
    purchasePlace,
    percentage
  } = props;

  const [progress, setProgress] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [listProducts, setListProducts] = useState({ done: "", total: "" });
  const targetProgress = percentage;

  const getListProducts = () => {
    const listArray = list;
    let done = 0;
    let total = 0;

    listArray.forEach((item) => {
      if (item.status) {
        done++;
      }
      total++;
    });

    setListProducts({ done, total });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 0.01;
        return newProgress >= targetProgress ? targetProgress : newProgress;
      });
    }, 20);

    getListProducts();

    return () => clearInterval(interval);
  }, []);

  return (
    <Animatable.View key={id} style={styles.container} animation="fadeIn" duration={1500} delay={90}>
      <View style={styles.header}>
        <Text style={styles.title}>{truncateText(name, 26)}</Text>
        <TouchableOpacity onPress={toggleDropdown}>
          <AntDesign name={isDropdownOpen ? 'up' : 'down'} size={25} color="#555" />
        </TouchableOpacity>
      </View>
      <View style={styles.progressBarContainer}>
        <ProgressBar progress={progress} width={300} height={11} color="#4CAF50" />
        <Text style={styles.progressText}>{`${Math.round(progress * 100)}%`}</Text>
      </View>
      {isDropdownOpen && (
        <>
          <Text style={styles.bottomText}>- {listProducts.done} de {listProducts.total} produtos restantes</Text>
          <Text style={styles.bottomText}>- {purchasePlace} (sugestão)</Text>
        </>
      )}
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 15,
    backgroundColor: '#FEFDFD',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    margin: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 10,
  },
  bottomText: {
    marginLeft: 10,
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
});

export default CardList;
