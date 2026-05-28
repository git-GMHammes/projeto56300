import type { ComponentType } from 'react'
import TimelineSheet from './sheets/TimelineSheet'
import DMSheet from './sheets/DMSheet'
import GroupsSheet from './sheets/GroupsSheet'

export interface SheetContentProps {
  onClose: () => void
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

export const SHEET_REGISTRY: Record<string, ComponentType<SheetContentProps>> = {
  timeline: TimelineSheet,
  dm: DMSheet,
  groups: GroupsSheet,
}
