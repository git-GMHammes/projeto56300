import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './NotificationsScreen.styles';

export const NotificationsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications Screen</Text>
      <Text style={styles.subtitle}>Stay updated with your notifications</Text>
    </View>
  );
};