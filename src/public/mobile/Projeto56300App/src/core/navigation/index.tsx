import React, { useState, useCallback } from 'react'
import { View, Platform, StatusBar } from 'react-native'

// ── Navigation prop types ──────────────────────────────────────────────────

export type NavigationProp<ParamList extends Record<string, any>> = {
  navigate<K extends keyof ParamList>(name: K, params?: ParamList[K]): void
  goBack(): void
}

export type RouteProp<
  ParamList extends Record<string, any>,
  K extends keyof ParamList,
> = {
  name: K & string
  params: ParamList[K]
}

export type NativeStackScreenProps<
  ParamList extends Record<string, any>,
  K extends keyof ParamList = keyof ParamList,
> = {
  navigation: NavigationProp<ParamList>
  route: RouteProp<ParamList, K>
}

// Stub types for linking configs (ignored at runtime)
export type LinkingOptions<_T = any> = {
  prefixes: string[]
  config?: any
}
export type PathConfig<_T = any> = {
  screens: Record<string, any>
}

// ── createNativeStackNavigator ─────────────────────────────────────────────

type RouteEntry = { name: string; params: Record<string, any> }

export function createNativeStackNavigator<
  ParamList extends Record<string, any>,
>() {
  // Screen acts as a data node — Navigator reads its props from children
  function Screen(_props: {
    name: keyof ParamList & string
    component: React.ComponentType<any>
    options?: any
  }): null {
    return null
  }

  function Navigator({
    children,
    initialRouteName,
    screenOptions: _screenOptions,
  }: {
    children: React.ReactNode
    initialRouteName?: keyof ParamList & string
    screenOptions?: any
  }) {
    const screenMap: Record<string, React.ComponentType<any>> = {}

    React.Children.forEach(children, child => {
      if (React.isValidElement(child) && child.type === Screen) {
        const p = child.props as {
          name: string
          component: React.ComponentType<any>
        }
        screenMap[p.name] = p.component
      }
    })

    const names = Object.keys(screenMap)
    const first = (initialRouteName as string | undefined) ?? names[0] ?? ''

    const [stack, setStack] = useState<RouteEntry[]>([{ name: first, params: {} }])

    const navigate = useCallback((name: string, params?: any) => {
      setStack(prev => {
        const existingIdx = prev.findIndex(e => e.name === name)
        if (existingIdx !== -1) return prev.slice(0, existingIdx + 1)
        return [...prev, { name, params: params ?? {} }]
      })
    }, [])

    const goBack = useCallback(() => {
      setStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev))
    }, [])

    const current = stack[stack.length - 1]
    const Component = screenMap[current.name]

    if (!Component) return null

    return (
      <Component
        navigation={{ navigate: navigate as any, goBack }}
        route={{ name: current.name, params: current.params }}
      />
    )
  }

  return { Navigator, Screen }
}

// ── NavigationContainer ────────────────────────────────────────────────────
// Accepts linking prop for API compatibility but ignores it.

export function NavigationContainer({
  children,
}: {
  children: React.ReactNode
  linking?: any
}) {
  return <>{children}</>
}

// ── SafeAreaProvider ───────────────────────────────────────────────────────

export function SafeAreaProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

// ── SafeAreaView ───────────────────────────────────────────────────────────
// Pure-JS implementation — avoids the deprecated react-native SafeAreaView
// and does not require react-native-safe-area-context (removed: NDK OOM).

// Android API 35 (edge-to-edge): a zona de interceptação da barra de status
// vai além do StatusBar.currentHeight reportado. Mínimo de 56dp garante que
// qualquer elemento tocável fique abaixo dessa zona.
const ANDROID_TOP_INSET =
  Platform.OS === 'android'
    ? (StatusBar.currentHeight ?? 24)
    : 0

export const ANDROID_BOTTOM_INSET = Platform.OS === 'android' ? 16 : 0

export function SafeAreaView({
  children,
  style,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      style={[{ paddingTop: ANDROID_TOP_INSET }, style]}
      {...props}
    >
      {children}
    </View>
  )
}
