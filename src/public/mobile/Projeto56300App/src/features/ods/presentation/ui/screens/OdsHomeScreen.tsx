import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import OdsLayout from '../components/OdsLayout'
import type { OdsPageScreenProps } from '../../routes/types'

export default function OdsHomeScreen({ navigation }: OdsPageScreenProps) {
  return (
    <OdsLayout navigation={navigation}>
      <View style={styles.center}>
        <Pressable
          onPress={() => (navigation as any).navigate('Login')}
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          accessibilityLabel="Acessar o sistema"
        >
          <Text style={styles.btnText}>Acessar o sistema</Text>
        </Pressable>
      </View>
    </OdsLayout>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  btnPressed: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  btnText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 0.5,
  },
})
