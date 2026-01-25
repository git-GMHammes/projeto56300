import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { HomeScreen, AccountScreen, SettingsScreen, NotificationsScreen } from '../screens';
import type { MainTabParamList } from '../../../core/navigation/types';
import type { TabIconProps } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Render functions para ícones (definidas fora para evitar re-criação)
const renderHomeIcon = ({ color, size }: TabIconProps) => (
  <Icon name="home-outline" size={size} color={color} />
);

const renderNotificationsIcon = ({ color, size }: TabIconProps) => (
  <Icon name="notifications-outline" size={size} color={color} />
);

const renderSettingsIcon = ({ color, size }: TabIconProps) => (
  <Icon name="settings-outline" size={size} color={color} />
);

const renderAccountIcon = ({ color, size }: TabIconProps) => (
  <Icon name="person-outline" size={size} color={color} />
);

export const MainNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#007AFF',
          elevation: 4,
          shadowOpacity: 0.3,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: '#fff',
        },
        headerTintColor: '#fff',
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: renderHomeIcon,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: renderNotificationsIcon,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: renderSettingsIcon,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: renderAccountIcon,
        }}
      />
    </Tab.Navigator>
  );
};
