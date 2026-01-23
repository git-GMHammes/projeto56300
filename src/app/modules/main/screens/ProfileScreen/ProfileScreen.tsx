import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../authentication/store/authSlice';
import { RootState } from '../../../../core/store';
import { styles } from './ProfileScreen.styles';

export const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.value}>{user.user}</Text>
          <Text style={styles.label}>User ID:</Text>
          <Text style={styles.value}>{user.id}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};