import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Public Pages
import Home from './pages/public/Home'
import Products from './pages/public/Products'
import ProductDetail from './pages/public/ProductDetail'
import About from './pages/public/About'
import Contact from './pages/public/Contact'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminInquiries from './pages/admin/AdminInquiries'
import AdminReviews from './pages/admin/AdminReviews'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'

// Protected Route
import ProtectedRoute from './components/admin/ProtectedRoute'

function App() {
  return (
    <BrowserRouter basename="/AaradhyaItSolutions">
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/inquiries" element={<AdminInquiries />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App