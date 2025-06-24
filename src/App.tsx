import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import BlogPage from './pages/BlogPage'
import ResumePage from './pages/ResumePage'
import AboutPage from './pages/AboutPage'
import AdminPage from './pages/AdminPage'
import ProtectedRoute from './components/ProtectedRoute'

/**
 * Main application component that sets up routing and authentication context
 */
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:eventId" element={<BlogPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route 
            path="admin" 
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App