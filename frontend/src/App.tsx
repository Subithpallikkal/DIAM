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
    colorBorder: '#d8dee8',
    colorText: '#1f2937',
    colorTextSecondary: '#6b7280',
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    Layout: {
      siderBg: UI.sidebar,
      headerBg: '#ffffff',
      bodyBg: '#f4f6f9',
      triggerBg: '#2c3e50',
    },
    Menu: {
      darkItemBg: UI.sidebar,
      darkSubMenuItemBg: UI.sidebar,
      darkItemSelectedBg: UI.brand,
      darkItemHoverBg: 'rgba(255, 255, 255, 0.08)',
      itemBorderRadius: 6,
      iconSize: 18,
    },
    Table: {
      headerBg: UI.tableHeader,
      headerColor: '#ffffff',
      borderColor: UI.tableBorder,
      rowHoverBg: UI.rowHover,
      headerBorderRadius: 0,
    },
    Input: {
      colorBorder: '#d8dee8',
      activeBorderColor: UI.brand,
      hoverBorderColor: '#b8c4d9',
      paddingBlock: 8,
      paddingInline: 12,
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
