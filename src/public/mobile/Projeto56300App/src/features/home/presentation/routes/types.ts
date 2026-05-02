import type { NavigationProp } from '../../../../core/navigation'

export type HomeStackParamList = {
  Home: undefined
}

export type HomePageScreenProps = {
  navigation: NavigationProp<HomeStackParamList>
  route: { name: keyof HomeStackParamList; params: undefined }
}
