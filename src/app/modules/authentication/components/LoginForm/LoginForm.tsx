import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { authApi } from '../../services/authApi';
import { styles } from './LoginForm.styles';

export const LoginForm: React.FC = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!user.trim()) {
      Alert.alert('Erro', 'Digite o usuário');
      return;
    }
    
    if (!password.trim()) {
      Alert.alert('Erro', 'Digite a senha');
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.login({ user: user.trim(), password });

      if (response.status === 'success') {
        Alert.alert('Sucesso', 'Login realizado com sucesso!');

        if ('token' in response.data && 'user' in response.data) {
          console.log('Token:', response.data.token);
          console.log('User:', response.data.user);
        }
      } else {
        // Trata erros da API
        let errorMessage = response.message;

        // Se há erros de validação, pega o primeiro
        if (response.data && typeof response.data === 'object' && 'validation' in response.data) {
          const validationData = response.data as { validation: Record<string, string> };
          const firstValidationError = Object.values(validationData.validation)[0];
          if (firstValidationError) {
            errorMessage = firstValidationError;
          }
        }

        Alert.alert('Erro', errorMessage);
      }
    } catch (error) {
      Alert.alert('Erro', `Falha na conexão: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Usuário</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu usuário"
        value={user}
        onChangeText={setUser}
        editable={!loading}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
