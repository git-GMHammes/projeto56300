import React from 'react';
import { View, Text } from 'react-native';
import { LoginForm } from '../../components/LoginForm';
import { styles } from './LoginScreen.styles';

export const LoginScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <LoginForm />
    </View>
  );
};