import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import PageTransition from './components/common/PageTransition'
import Home from './pages/Home'
import VisiMisi from './pages/VisiMisi'
import StrukturOrganisasi from './pages/StrukturOrganisasi'
import Kegiatan from './pages/Kegiatan'
import SocialImpactAssessment from './pages/SocialImpactAssessment'
import SocialReturnOnInvestment from './pages/SocialReturnOnInvestment'
import Kontak from './pages/Kontak'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/admin/ProtectedRoute'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <div className="App">
      <Navbar />
      <main>
        {/* AnimatePresence enables exit animations saat route berubah */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />
            <Route
              path="/tentang/visi-misi"
              element={
                <PageTransition>
                  <VisiMisi />
                </PageTransition>
              }
            />
            <Route
              path="/tentang/struktur-organisasi"
              element={
                <PageTransition>
                  <StrukturOrganisasi />
                </PageTransition>
              }
            />
            <Route
              path="/kegiatan"
              element={
                <PageTransition>
                  <Kegiatan />
                </PageTransition>
              }
            />
            <Route
              path="/kegiatan/social-impact-assessment"
              element={
                <PageTransition>
                  <SocialImpactAssessment />
                </PageTransition>
              }
            />
            <Route
              path="/kegiatan/social-return-on-investment"
              element={
                <PageTransition>
                  <SocialReturnOnInvestment />
                </PageTransition>
              }
            />
            <Route
              path="/kontak"
              element={
                <PageTransition>
                  <Kontak />
                </PageTransition>
              }
            />
            <Route
              path="/login"
              element={
                <PageTransition>
                  <Login />
                </PageTransition>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={
                <PageTransition>
                  <NotFound />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  )
}

export default App
