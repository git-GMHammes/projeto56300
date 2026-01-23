import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import type { StackNavigationProp } from '@react-navigation/stack';
import { logout } from '../../../authentication/store/authSlice';
import { RootState } from '../../../../core/store';
import type { RootStackParamList } from '../../../../core/navigation/types';
import { styles } from './AccountScreen.styles';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const AccountScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLoginPress = () => {
    navigation.navigate('Auth', { screen: 'Login' });
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isAuthenticated) {
    // Usuário NÃO autenticado - Mostrar botão de Login
    return (
      <View style={styles.container}>
        <View style={styles.notAuthContainer}>
          <Text style={styles.title}>Minha Conta</Text>
          <Text style={styles.subtitle}>Faça login para acessar sua conta</Text>

          <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
            <Text style={styles.loginButtonText}>Fazer Login</Text>
          </TouchableOpacity>

          <Text style={styles.infoText}>
            Após fazer login, você terá acesso a funcionalidades exclusivas!
          </Text>
        </View>
      </View>
    );
  }

  // Usuário AUTENTICADO - Mostrar perfil e logout
  return (
    <View style={styles.container}>
      <View style={styles.authContainer}>
        <Text style={styles.title}>Minha Conta</Text>

        {user && (
          <View style={styles.userInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Usuário:</Text>
              <Text style={styles.value}>{user.user}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>ID:</Text>
              <Text style={styles.value}>{user.id}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Último acesso:</Text>
              <Text style={styles.value}>
                {new Date(user.last_login).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};