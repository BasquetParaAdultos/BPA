import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { TaskProvider } from './context/TaskContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import TaskPage from './pages/TaskPage'
import TaskFormPage from './pages/TaskFormPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import ClassesPage from './pages/ClassesPage'
import AdminClassesPage from './pages/AdminClassesPage';
import PaymentStatus from './pages/PaymentStatus';
import ActiveSubscriptionsTable from './components/ActiveSubscriptionsTable';

import ProtectedRoute from './ProtectedRoute'
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute';


useEffect(() => {
  console.log("Environment Variables:", {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    MODE: import.meta.env.MODE,
    NODE_ENV: import.meta.env.NODE_ENV
  });
}, []);


function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
            <Navbar />
            <main className='container mx-auto px-10'>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Rutas protegidas para usuarios normales */}
              <Route element={<ProtectedRoute />}>
                <Route path="/tasks" element={<TaskPage />} />
                <Route path="/add-task" element={<TaskFormPage />} />
                <Route path="/tasks/:id" element={<TaskFormPage />} />
                <Route path="/profile" element={<ProfilePage />} /> {/* Perfil propio */}
                <Route path="/classes" element={<ClassesPage />} />
                <Route path="/payment/success" element={<PaymentStatus />} />
                <Route path="/payment/failure" element={<PaymentStatus />} />
                <Route path="/payment/pending" element={<PaymentStatus />} />
              </Route>

              {/* Rutas protegidas para administradores */}
              <Route element={<ProtectedAdminRoute />}>
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/classes" element={<AdminClassesPage />} />
                <Route path="/admin/active-subscriptions" element={<ActiveSubscriptionsTable />} />
                <Route path="/admin/user/:userId" element={<ProfilePage />} />
              </Route>
            </Routes>
          </main>
          <Footer/>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  )
}

export default App