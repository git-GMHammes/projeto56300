import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './HomeScreen.styles';

export const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.subtitle}>Welcome to the main application!</Text>
    </View>
  );
};
