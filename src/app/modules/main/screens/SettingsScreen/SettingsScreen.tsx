import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './SettingsScreen.styles';

export const SettingsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Screen</Text>
      <Text style={styles.subtitle}>Configure your application preferences</Text>
    </View>
  );
};
