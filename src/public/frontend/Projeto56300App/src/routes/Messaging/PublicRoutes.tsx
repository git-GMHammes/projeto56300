import MessagingTimeline from '../../pages/Messaging/Timeline/V1'
import MessagingPrivate from '../../pages/Messaging/Private/V1'
import MessagingGroups from '../../pages/Messaging/Groups/V1'
import MessagingGroupDetail from '../../pages/Messaging/Groups/V1/Detail'

const messagingPublicRoutes = [
  {
    path: '/v1/messaging/timeline',
    element: <MessagingTimeline />,
  },
  {
    path: '/v1/messaging/private',
    element: <MessagingPrivate />,
  },
  {
    path: '/v1/messaging/groups',
    element: <MessagingGroups />,
  },
  {
    path: '/v1/messaging/groups/:groupId',
    element: <MessagingGroupDetail />,
  },
]

export default messagingPublicRoutes
