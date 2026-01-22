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
      const data = await authApi.login(user, password);

      if (data.status === 'success') {
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        console.log('Token:', data.data.token);
      } else {
        const errorMsg = data.data?.validation 
          ? Object.values(data.data.validation)[0]
          : data.message;
        Alert.alert('Erro', errorMsg);
      }
    } catch (error) {
      Alert.alert('Erro', `Falha na conexão ${error}`);
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
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
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