import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import WidgetDashboard from '@/components/pages/WidgetDashboard'
import WidgetBuilder from '@/components/pages/WidgetBuilder'
import Analytics from '@/components/pages/Analytics'
import Settings from '@/components/pages/Settings'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Layout>
          <Routes>
            <Route path="/" element={<WidgetDashboard />} />
            <Route path="/widgets" element={<WidgetDashboard />} />
            <Route path="/create-widget" element={<WidgetBuilder />} />
            <Route path="/edit-widget/:id" element={<WidgetBuilder />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  )
}

export default App