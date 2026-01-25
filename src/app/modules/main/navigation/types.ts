import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../../../core/navigation/types';

// Props para cada tela do Tab Navigator
export type HomeScreenProps = BottomTabScreenProps<MainTabParamList, 'Home'>;
export type NotificationsScreenProps = BottomTabScreenProps<MainTabParamList, 'Notifications'>;
export type SettingsScreenProps = BottomTabScreenProps<MainTabParamList, 'Settings'>;
export type AccountScreenProps = BottomTabScreenProps<MainTabParamList, 'Account'>;

// Props para ícones do Tab Bar
export interface TabIconProps {
  color: string;
  size: number;
}