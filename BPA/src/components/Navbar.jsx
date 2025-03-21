import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='bg-zinc-700 my-3 py-5 px-4 md:px-10 rounded-lg text-white'>
      <div className='flex justify-between items-center'>
        <Link to={isAuthenticated ? '/tasks' : '/'}>
          <h1 className='text-2xl font-bold'>Basquet para adultos</h1>
        </Link>

        {/* Menú Hamburguesa para móvil */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='md:hidden p-2 text-gray-400 hover:text-white focus:outline-none'
        >
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
          </svg>
        </button>

        {/* Menú de escritorio */}
        <div className='hidden md:flex gap-x-4 items-center'>
          {renderMenuItems()}
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {isOpen && (
        <div className='md:hidden mt-4 space-y-4'>
          {renderMobileMenuItems()}
        </div>
      )}
    </nav>
  );

  function renderMenuItems() {
    return isAuthenticated ? (
      <>
        <span className='text-gray-300'>Bienvenido {user.username}</span>
        {user?.role === 'admin' && (
          <>
            <Link
              to="/admin"
              className='bg-indigo-500 px-4 py-2 rounded-sm hover:bg-indigo-600 transition-colors'
            >
              Panel Admin
            </Link>
            <Link
              to="/admin/classes"
              className='bg-indigo-500 px-4 py-2 rounded-sm hover:bg-indigo-600 transition-colors'
            >
              Clases
            </Link>
          </>
        )}
        {user?.role !== 'admin' && user?.payment_status === 'paid' && (
          <Link
            to='/classes'
            className='bg-indigo-500 px-4 py-2 rounded-sm hover:bg-indigo-600 transition-colors'
            onClick={() => setIsOpen(false)}
          >
            Añadir asistencia
          </Link>
        )}
        <Link
          to='/profile'
          className='bg-indigo-500 px-4 py-2 rounded-sm hover:bg-indigo-600 transition-colors'
        >
          Ir al perfil
        </Link>
        <button
          onClick={() => {
            logout();
            setIsOpen(false);
          }}
          className='bg-indigo-500 px-4 py-2 rounded-sm hover:bg-indigo-600 transition-colors'
        >
          Cerrar sesión
        </button>
      </>
    ) : (
      <>
        <Link
          to='/login'
          className='bg-indigo-500 px-4 py-2 rounded-sm hover:bg-indigo-600 transition-colors'
        >
          Iniciar Sesión
        </Link>
        <Link
          to='/register'
          className='bg-indigo-500 px-4 py-2 rounded-sm hover:bg-indigo-600 transition-colors'
        >
          Registrarse
        </Link>
      </>
    );
  }

  function renderMobileMenuItems() {
    return isAuthenticated ? (
      <div className='flex flex-col space-y-2'>
        <span className='block px-4 py-2 text-gray-300'>Bienvenido {user.username}</span>
        {user?.role === 'admin' && (
          <>
            <Link
              to="/admin"
              className='block px-4 py-2 bg-indigo-500 rounded-sm hover:bg-indigo-600 transition-colors'
              onClick={() => setIsOpen(false)}
            >
              Panel Admin
            </Link>
            <Link
              to="/admin/classes"
              className='block px-4 py-2 bg-indigo-500 rounded-sm hover:bg-indigo-600 transition-colors'
              onClick={() => setIsOpen(false)}
            >
              Clases
            </Link>
          </>
        )}
        {user?.role !== 'admin' && user?.payment_status === 'paid' && (
          <Link
            to='/classes'
            className='bg-indigo-500 px-4 py-2 rounded-sm hover:bg-indigo-600 transition-colors'
            onClick={() => setIsOpen(false)}
          >
            Añadir asistencia
          </Link>
        )}
        <Link
          to='/profile'
          className='block px-4 py-2 bg-indigo-500 rounded-sm hover:bg-indigo-600 transition-colors'
          onClick={() => setIsOpen(false)}
        >
          Ir al perfil
        </Link>
        <button
          onClick={() => {
            logout();
            setIsOpen(false);
          }}
          className='w-full text-left px-4 py-2 bg-indigo-500 rounded-sm hover:bg-indigo-600 transition-colors'
        >
          Cerrar sesión
        </button>
      </div>
    ) : (
      <div className='flex flex-col space-y-2'>
        <Link
          to='/login'
          className='block px-4 py-2 bg-indigo-500 rounded-sm hover:bg-indigo-600 transition-colors'
          onClick={() => setIsOpen(false)}
        >
          Iniciar Sesión
        </Link>
        <Link
          to='/register'
          className='block px-4 py-2 bg-indigo-500 rounded-sm hover:bg-indigo-600 transition-colors'
          onClick={() => setIsOpen(false)}
        >
          Registrarse
        </Link>
      </div>
    );
  }
}

export default Navbar;