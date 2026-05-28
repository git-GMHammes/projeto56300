import React, { useState, useEffect } from 'react'
import { useCurrentRoute } from '../../../core/navigation/RouteContext'
import { View, StyleSheet } from 'react-native'
import { MESSAGING_PATHS } from './paths'
import type { MessagingStackParamList } from './types'
import TimelineScreen from './messageTimeline/presentation/ui/screens/TimelineScreen'
import TimelineReactionScreen from './messageTimelineReaction/presentation/ui/screens/TimelineReactionScreen'
import PrivateScreen from './messagePrivate/presentation/ui/screens/PrivateScreen'
import GroupScreen from './msgGroup/presentation/ui/screens/GroupScreen'
import GroupMemberScreen from './messageGroupMember/presentation/ui/screens/GroupMemberScreen'
import GroupMessageScreen from './messageGroup/presentation/ui/screens/GroupMessageScreen'
import MessageFileScreen from './messageFile/presentation/ui/screens/MessageFileScreen'

const SUB_ROUTE_NAMES: Record<string, string> = {
  [MESSAGING_PATHS.TIMELINE]:          'Timeline',
  [MESSAGING_PATHS.TIMELINE_REACTION]: 'TimelineReaction',
  [MESSAGING_PATHS.PRIVATE]:           'Private',
  [MESSAGING_PATHS.GROUP]:             'Group',
  [MESSAGING_PATHS.GROUP_MEMBER]:      'GroupMember',
  [MESSAGING_PATHS.GROUP_MESSAGE]:     'GroupMessage',
  [MESSAGING_PATHS.GROUP_READ]:        'GroupRead',
  [MESSAGING_PATHS.FILE]:              'File',
}

const MAIN_TAB_KEYS = new Set<string>([
  MESSAGING_PATHS.TIMELINE,
  MESSAGING_PATHS.PRIVATE,
  MESSAGING_PATHS.GROUP,
])

type MessagingScreen = keyof MessagingStackParamList
type NavParams = MessagingStackParamList[MessagingScreen]

interface NavState {
  screen: MessagingScreen
  params?: NavParams
}

interface Props {
  initialScreen?: MessagingScreen
  goBack?: () => void
}

export default function MessagingNavigator({ initialScreen = MESSAGING_PATHS.TIMELINE, goBack }: Props) {
  const [nav, setNav] = useState<NavState>({ screen: initialScreen })
  const { setCurrentRoute } = useCurrentRoute()

  useEffect(() => {
    const subName = SUB_ROUTE_NAMES[nav.screen] ?? nav.screen
    const timer = setTimeout(() => {
      setCurrentRoute(`Messaging/${subName}`)
    }, 0)
    return () => clearTimeout(timer)
  }, [nav.screen, setCurrentRoute])

  function navigate(screen: MessagingScreen, params?: NavParams) {
    setNav({ screen, params })
  }

  function handleBack() {
    if (!MAIN_TAB_KEYS.has(nav.screen)) {
      setNav({ screen: initialScreen })
    } else {
      goBack?.()
    }
  }

  const { screen, params } = nav

  function renderScreen() {
    switch (screen) {
      case MESSAGING_PATHS.PRIVATE:
        return <PrivateScreen navigate={navigate} goBack={handleBack} />

      case MESSAGING_PATHS.GROUP:
        return <GroupScreen navigate={navigate} goBack={handleBack} />

      case MESSAGING_PATHS.GROUP_MESSAGE: {
        const p = params as MessagingStackParamList[typeof MESSAGING_PATHS.GROUP_MESSAGE]
        return <GroupMessageScreen groupId={p.groupId} navigate={navigate} goBack={handleBack} />
      }

      case MESSAGING_PATHS.TIMELINE_REACTION: {
        const p = params as MessagingStackParamList[typeof MESSAGING_PATHS.TIMELINE_REACTION]
        return <TimelineReactionScreen timelineId={p.timelineId} navigate={navigate} goBack={handleBack} />
      }

      case MESSAGING_PATHS.GROUP_MEMBER: {
        const p = params as MessagingStackParamList[typeof MESSAGING_PATHS.GROUP_MEMBER]
        return <GroupMemberScreen groupId={p.groupId} navigate={navigate} goBack={handleBack} />
      }

      case MESSAGING_PATHS.FILE: {
        const p = params as MessagingStackParamList[typeof MESSAGING_PATHS.FILE]
        return <MessageFileScreen source={p.source} sourceId={p.sourceId} navigate={navigate} goBack={handleBack} />
      }

      default:
        return <TimelineScreen navigate={navigate} goBack={handleBack} />
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
})
