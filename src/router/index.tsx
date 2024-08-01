import { createBrowserRouter, Navigate, RouteObject, RouterProvider } from 'react-router-dom'

import UserProfilePage from '@/components/UserProfileForm'
import MainLayout from '@/components/layout/MainLyout'
import FullpageLoading from '@/components/loading/FullpageLoading'
import HomePage from '@/pages'
import CheckPage from '@/pages/check'
import JobPostPage from '@/pages/create-job'
import Page404 from '@/pages/fallbacks/page-404'
import JobsListPage from '@/pages/job-list'
import LoginPage from '@/pages/login'

import AuthCheck from './authcheck'
import lazy from './lazy'

export const routerConfig: RouteObject[] = [
  {
    path: '/',
    element: (
      <AuthCheck>
        <MainLayout />
      </AuthCheck>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'job/create', element: <JobPostPage /> },
      { path: 'profile/me', element: <UserProfilePage /> },
      { path: 'jobs', element: <JobsListPage /> },
      {
        path: 'check',
        element: <CheckPage />,
        children: [
          { path: 'check-zustand', element: lazy(() => import('@/pages/check/check-zustand')) },
          { path: 'check-emotion', element: lazy(() => import('@/pages/check/check-emotion')) },
          { path: 'check-sass', element: lazy(() => import('@/pages/check/check-sass')) },
          { path: 'check-less', element: lazy(() => import('@/pages/check/check-less')) },
          { path: 'check-twcss', element: lazy(() => import('@/pages/check/check-tailwindcss')) },
          { path: 'check-toast', element: lazy(() => import('@/pages/check/check-toast')) },
          { path: 'check-request', element: lazy(() => import('@/pages/check/check-request')) },
        ],
      },
      { path: '404', element: <Page404 /> },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
]

export const router = createBrowserRouter(routerConfig, { basename: process.env.PUBLIC_URL })

export default function RouterEntry() {
  return <RouterProvider router={router} fallbackElement={<FullpageLoading />} />
}
