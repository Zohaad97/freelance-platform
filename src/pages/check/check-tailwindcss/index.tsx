import { Button, Menu, MenuItem } from '@mui/material'
import { useRef, useState } from 'react'

export default function CheckTailwindcss(): RC {
  const [isOpen, setIsOpen] = useState(false)
  const menuAnchorElRef = useRef<HTMLElement>()

  return (
    <div>
      <p>以下三个 div 宽度不同，则 tailwindcss 正常生效：</p>
      <div className="w-48 bg-slate-300">我是宽度 48 （192px）</div>
      <div className="w-64 bg-slate-300">我是宽度 48 （256px）</div>
      <div className="w-96 bg-slate-300">我是宽度 96 （384px）</div>

      <p>以下两个按钮颜色不同，则 tailwindcss 能正常覆盖 UI 库的样式：</p>
      <Button variant="contained">普通按钮</Button>
      <Button variant="contained" className="bg-green-600">
        绿色按钮
      </Button>

      <p>为 mui 的弹出类组件测试是否正确应用 tailwindcss：</p>
      <Button
        variant="contained"
        onClick={e => {
          menuAnchorElRef.current = e.currentTarget
          setIsOpen(true)
        }}
      >
        打开菜单
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={menuAnchorElRef.current}
        open={isOpen}
        onClose={() => void setIsOpen(false)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => void setIsOpen(false)}>普通菜单项</MenuItem>
        <MenuItem className="bg-green-600" onClick={() => void setIsOpen(false)}>
          绿色菜单项
        </MenuItem>
      </Menu>
    </div>
  )
}
