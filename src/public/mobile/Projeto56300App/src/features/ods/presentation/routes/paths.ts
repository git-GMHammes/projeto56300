export const ODS_PATHS = {
  P01: 'OdsP01',
  P02: 'OdsP02',
  P03: 'OdsP03',
  P04: 'OdsP04',
  P05: 'OdsP05',
  P06: 'OdsP06',
  P07: 'OdsP07',
  P08: 'OdsP08',
  P09: 'OdsP09',
  P10: 'OdsP10',
  P11: 'OdsP11',
  P12: 'OdsP12',
  P13: 'OdsP13',
  P14: 'OdsP14',
  P15: 'OdsP15',
  P16: 'OdsP16',
  P17: 'OdsP17',
  P18: 'OdsP18',
} as const

export type OdsPathKey = keyof typeof ODS_PATHS
export type OdsPath = (typeof ODS_PATHS)[OdsPathKey]
