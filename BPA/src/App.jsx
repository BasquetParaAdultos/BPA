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

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter basename='/'>
          {/* Contenedor principal con ancho mínimo */}
          <div className="flex flex-col min-h-screen min-w-[280px] overflow-x-hidden">
            <Navbar />
            
            {/* Contenedor de contenido con padding responsive mejorado */}
            <main className='container mx-auto flex-grow w-full max-w-screen-2xl 
                             px-[3vw] min-[340px]:px-[4vw] min-[400px]:px-[5vw] min-[450px]:px-6 sm:px-8 md:px-10'>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Rutas protegidas para usuarios normales */}
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
          </div>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  )
}

export default App