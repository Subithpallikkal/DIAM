import { ConfigProvider } from 'antd'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppRoutes } from './routes/AppRoutes'
import { UI } from './lib/ui'

const theme = {
  token: {
    colorPrimary: UI.brand,
    colorInfo: UI.brand,
    colorSuccess: '#0d9f6e',
    colorWarning: '#e8a317',
    colorError: '#d64545',
    borderRadius: 8,
    controlHeight: 36,
    controlHeightLG: 40,
    colorBorder: '#d8dee8',
    colorText: '#1f2937',
    colorTextSecondary: '#6b7280',
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    Layout: {
      siderBg: UI.sidebar,
      headerBg: UI.contentSurface,
      bodyBg: UI.contentSurface,
      triggerBg: UI.shellInner,
    },
    Menu: {
      darkItemBg: 'transparent',
      darkSubMenuItemBg: UI.sidebar,
      darkItemSelectedBg: 'rgba(255, 255, 255, 0.15)',
      darkItemHoverBg: 'rgba(255, 255, 255, 0.1)',
      itemBorderRadius: 12,
      iconSize: 18,
    },
    Table: {
      headerBg: UI.tableHeader,
      headerColor: '#ffffff',
      borderColor: UI.tableBorder,
      rowHoverBg: UI.rowHover,
      headerBorderRadius: 0,
      cellPaddingBlock: 4,
      cellPaddingBlockSM: 4,
      cellPaddingInline: 8,
      cellPaddingInlineSM: 8,
    },
    Input: {
      colorBorder: '#d8dee8',
      activeBorderColor: UI.brand,
      hoverBorderColor: '#b8c4d9',
      paddingBlock: 6,
      paddingInline: 10,
    },
    Button: {
      primaryShadow: 'none',
      defaultBorderColor: '#c5d0e0',
      defaultColor: UI.brand,
    },
    Card: {
      borderRadiusLG: 10,
    },
    Modal: {
      borderRadiusLG: 6,
    },
    Tag: {
      borderRadiusSM: 20,
    },
  },
}

function App() {
  return (
    <ConfigProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
