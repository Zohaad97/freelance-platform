import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

export default function CheckPage(): RC {
  return (
    <div>
      <p>我是测试 Layout</p>
      <Box border={2} padding={1}>
        <Outlet />
      </Box>
    </div>
  )
}
