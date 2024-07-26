import { Button, Container } from '@mui/material'
import { Outlet } from 'react-router-dom'

import { logout } from '@/firebaseconfig'
import { useUserStore } from '@/services/user'

export default function MainLayout(): RC {
  const currentUser = useUserStore(s => s.userInfo)
  const username = currentUser?.name

  return (
    <Container>
      <p>Hello, {username}</p>
      <Outlet />

      <Button onClick={() => logout()} variant="contained">
        Logout
      </Button>
    </Container>
  )
}
