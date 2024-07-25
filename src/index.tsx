import CssBaseline from '@mui/material/CssBaseline'
import { zhCN } from '@mui/material/locale'
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import { LocalizationProvider, zhCN as zhCNXDateLocal } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import zhCNDateFns from 'date-fns/locale/zh-CN'
import { SnackbarProvider } from 'notistack'
import React from 'react'
import ReactDOM from 'react-dom/client'

import RouterEntry from './router'

import '@/styles/app.scss'
import '@/styles/tailwind.css'

const rootElement = document.getElementById('root')
const root = ReactDOM.createRoot(rootElement!)

const theme = createTheme(
  // ↓ 下面这个对象是给 tailwindcss 配合使用配置的，如果不用它，可以删去
  {
    components: {
      MuiPopover: {
        defaultProps: {
          container: rootElement,
        },
      },
      MuiPopper: {
        defaultProps: {
          container: rootElement,
        },
      },
    },
  },
  zhCN
)

// ↓ <StyledEngineProvider injectFirst> 组件是为了配合 tailwindcss 使用的，不使用它则可以删去

root.render(
  <React.Fragment>
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={zhCNDateFns}
        localeText={zhCNXDateLocal.components.MuiLocalizationProvider.defaultProps.localeText}
      >
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <RouterEntry />
          </SnackbarProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </StyledEngineProvider>
  </React.Fragment>
)
