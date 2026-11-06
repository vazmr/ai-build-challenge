import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { AssistantPage } from '../features/assistant/AssistantPage'
import { CalendarPage } from '../features/calendar/CalendarPage'
import { CommunityDetailPage } from '../features/community/CommunityDetailPage'
import { CommunityPage } from '../features/community/CommunityPage'
import { FoundingPage } from '../features/community/FoundingPage'
import { ThreadPage } from '../features/community/ThreadPage'
import { EventDetailPage } from '../features/events/EventDetailPage'
import { EventsPage } from '../features/events/EventsPage'
import { FeedPage } from '../features/feed/FeedPage'
import { MapPage } from '../features/map/MapPage'
import { MessagesPage } from '../features/messaging/MessagesPage'
import { AnnouncementsPage } from '../features/notifications/AnnouncementsPage'
import { NotificationsPage } from '../features/notifications/NotificationsPage'
import { SavedPage } from '../features/notifications/SavedPage'
import { OrganizationPage } from '../features/organizations/OrganizationPage'
import { OrganizationsPage } from '../features/organizations/OrganizationsPage'
import { WorkspacePage } from '../features/organizations/WorkspacePage'
import { ProfilePage } from '../features/profiles/ProfilePage'
import { ProjectDetailPage } from '../features/projects/ProjectDetailPage'
import { ProjectsPage } from '../features/projects/ProjectsPage'
import { ResourcesPage } from '../features/resources/ResourcesPage'
import { NotFoundPage } from '../features/settings/NotFoundPage'
import { RouteError } from '../features/settings/RouteError'
import { SettingsPage } from '../features/settings/SettingsPage'

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Navigate to="/feed" replace /> },
      { path: '/feed', element: <FeedPage /> },
      { path: '/map', element: <MapPage /> },
      { path: '/events', element: <EventsPage /> },
      { path: '/events/:eventId', element: <EventDetailPage /> },
      { path: '/community', element: <CommunityPage /> },
      { path: '/community/:communityId', element: <CommunityDetailPage /> },
      { path: '/community/:communityId/founding', element: <FoundingPage /> },
      { path: '/community/:communityId/threads/:threadId', element: <ThreadPage /> },
      { path: '/projects', element: <ProjectsPage /> },
      { path: '/projects/:projectId', element: <ProjectDetailPage /> },
      { path: '/profile/:userId', element: <ProfilePage /> },
      { path: '/organizations', element: <OrganizationsPage /> },
      { path: '/organizations/:organizationId', element: <OrganizationPage /> },
      { path: '/organizations/:organizationId/workspace', element: <WorkspacePage /> },
      { path: '/messages', element: <MessagesPage /> },
      { path: '/messages/:conversationId', element: <MessagesPage /> },
      { path: '/resources', element: <ResourcesPage /> },
      { path: '/assistant', element: <AssistantPage /> },
      { path: '/saved', element: <SavedPage /> },
      { path: '/calendar', element: <CalendarPage /> },
      { path: '/announcements', element: <AnnouncementsPage /> },
      { path: '/notifications', element: <NotificationsPage /> },
      { path: '/settings', element: <SettingsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
