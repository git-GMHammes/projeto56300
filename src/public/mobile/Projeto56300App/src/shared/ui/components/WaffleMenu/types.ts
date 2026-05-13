export interface WaffleMenuItem {
  icon: string
  label: string
  description?: string
  route: string
}

export interface WaffleMenuProps {
  items: WaffleMenuItem[]
  onItemPress: (item: WaffleMenuItem) => void
}
