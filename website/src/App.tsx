import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LangProvider } from './context/LangContext'
import { AuthProvider } from './context/AuthContext'
import { animationStyles } from './utils/animations'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ProductsPage from './pages/ProductsPage'
import ProjectsPage from './pages/ProjectsPage'
import ContactPage from './pages/ContactPage'
import ServicesPage from './pages/ServicesPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminOverview from './pages/admin/AdminOverview'
import AdminProducts from './pages/admin/AdminProducts'
import AdminInquiries from './pages/admin/AdminInquiries'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminUsers from './pages/admin/AdminUsers'
import AdminSettings from './pages/admin/AdminSettings'
import ProtectedRoute from './components/layout/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <LangProvider>
        <>
          <style>{animationStyles}</style>
          <BrowserRouter>
            <Routes>
              {/* Public website */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="services" element={<ServicesPage />} />
              </Route>

              {/* Admin login (public) */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin dashboard (protected) */}
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminOverview />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="inquiries" element={<AdminInquiries />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </>
      </LangProvider>
    </AuthProvider>
  )
}
