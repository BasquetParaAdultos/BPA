import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { TaskProvider } from './context/TaskContext'
import Navbar from './components/Navbar'

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

import ProtectedRoute from './ProtectedRoute'
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute';


function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
          <main className='container mx-auto px-10'>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/tasks" element={<TaskPage />} />
                <Route path="/add-task" element={<TaskFormPage />} />
                <Route path="/tasks/:id" element={<TaskFormPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/classes" element={<ClassesPage />} />
                <Route path="/payment/success" element={<PaymentStatus />} />
                <Route path="/payment/failure" element={<PaymentStatus />} />
                <Route path="/payment/pending" element={<PaymentStatus />} />
              </Route>

              <Route element={<ProtectedAdminRoute />}>
                <Route index path="/admin" element={<AdminPage />} />
                <Route path="/admin/classes" element={<AdminClassesPage />} />
              </Route>
            </Routes>
          </main>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  )
}

export default App