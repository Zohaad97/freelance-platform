import { Button, Container } from '@mui/material'
import { Outlet } from 'react-router-dom'

import { useUserStore } from '@/services/user'
import { signOut } from 'firebase/auth'
import { logout } from '@/firebaseconfig'

/** 全站主 Layout */
export default function MainLayout(): RC {
  const currentUser = useUserStore(s => s.userInfo)
  const username = currentUser?.name

  return (
    <Container>
      <p>Hello, {username}</p>
      <Outlet />

      <Button onClick={() => logout()} variant="contained">Logout</Button>
    </Container>
  )
}
