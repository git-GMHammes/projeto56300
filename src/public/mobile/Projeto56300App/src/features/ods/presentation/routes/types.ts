import type { NavigationProp } from '../../../../core/navigation'

export type OdsStackParamList = {
  OdsHome: undefined
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
}

export type OdsPageScreenProps = {
  navigation: NavigationProp<OdsStackParamList>
  route: { name: keyof OdsStackParamList; params: undefined }
}
