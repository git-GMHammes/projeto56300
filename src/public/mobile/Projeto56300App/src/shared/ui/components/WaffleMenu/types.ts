export interface WaffleMenuItem {
  key?: string
  icon: string
  label: string
  description?: string
  route: string
}

export interface WaffleMenuProps {
  items: WaffleMenuItem[]
  onItemPress: (item: WaffleMenuItem) => void
}
