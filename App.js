import React from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';

// Screen
import Home from './src/screen/Home';

const App = () => {
  return (
    <SafeAreaProvider>
      <ImageBackground
        src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhapcw-vU9Nt5hF39XiTpNlvv9R-UpSDLy7r_uqWmW_v76NUQ-W2ZGkpjDy_sCrzFHY_M&usqp=CAU'}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Appbar.Header style={{ backgroundColor: "#F3F9F9" }}>
          <Appbar.Content title="Minhas Listas" />
        </Appbar.Header>
        <View style={styles.container}>
          <Home />
        </View>
      </ImageBackground>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
  },
});

export default App;
