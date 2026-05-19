import type { NavigationProp } from '../../../../core/navigation'

export type HomeStackParamList = {
  Home: undefined
  OdsP01: undefined
  OdsP02: undefined
  OdsP03: undefined
  OdsP04: undefined
  OdsP05: undefined
  OdsP06: undefined
  OdsP07: undefined
  OdsP08: undefined
  OdsP09: undefined
  OdsP10: undefined
  OdsP11: undefined
  OdsP12: undefined
  OdsP13: undefined
  OdsP14: undefined
  OdsP15: undefined
  OdsP16: undefined
  OdsP17: undefined
  OdsP18: undefined
  Messaging: undefined
  Helper: undefined
}

export type HomePageScreenProps = {
  navigation: NavigationProp<HomeStackParamList>
  route: { name: keyof HomeStackParamList; params: undefined }
}
