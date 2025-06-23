import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navbarRef = useRef(null);
  const [showWelcomeText, setShowWelcomeText] = useState(false);

  // Cerrar el menú móvil al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Verificar el ancho de pantalla para mostrar texto de bienvenida
  useEffect(() => {
    const checkScreenWidth = () => {
      setShowWelcomeText(window.innerWidth >= 1024);
    };

    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
    return () => window.removeEventListener('resize', checkScreenWidth);
  }, []);

  return (
    <nav 
      ref={navbarRef}
      className='bg-zinc-700 my-3 py-3 px-4 md:px-6 lg:px-8 rounded-lg text-white sticky top-0 z-50'
    >
      <div className='flex justify-between items-center'>
        {/* Logo y nombre */}
        <Link
          to='/'
          className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0 min-w-0"
        >
          <img
            src="/images/home/logoBPA.png"
            alt="Logo BPA"
            className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-contain"
          />
          <h1 className='text-xl md:text-2xl font-bold whitespace-nowrap overflow-hidden truncate'>
            Básquet para adultos
          </h1>
        </Link>

        {/* Menú de escritorio */}
        <div className='hidden md:flex items-center gap-2'>
          {renderMenuItems()}
        </div>

        {/* Menú Hamburguesa para móvil */}
        <div className='md:hidden flex items-center'>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='p-2 text-gray-400 hover:text-white focus:outline-none'
            aria-label="Menú"
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path 
                strokeLinecap='round' 
                strokeLinejoin='round' 
                strokeWidth={2} 
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} 
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {isOpen && (
        <div className='md:hidden mt-4 space-y-3 animate-fadeIn'>
          {renderMobileMenuItems()}
        </div>
      )}
    </nav>
  );

  function renderMenuItems() {
    return isAuthenticated ? (
      <>        
        {showWelcomeText && (
          <span className='text-gray-300 mr-2 whitespace-nowrap'>
            Bienvenido, {user.username}
          </span>
        )}
        
        {user?.role === 'admin' && (
          <>
            <NavButton to="/admin" text="Panel Admin" />
            <NavButton to="/admin/classes" text="Clases" />
          </>
        )}
        
        {user?.role !== 'admin' && user?.subscription?.active && (
          <NavButton to='/classes' text="Añadir asistencia" />
        )}
        
        <NavButton to='/tasks' text="Inicio" />
        <NavButton to='/profile' text="Perfil" />
        <NavButton 
          onClick={() => logout()} 
          text="Cerrar sesión" 
          isButton={true}
        />
      </>
    ) : (
      <>
        <NavButton to='/login' text="Iniciar Sesión" />
        <NavButton to='/register' text="Registrarse" />
      </>
    );
  }

  function renderMobileMenuItems() {
    return isAuthenticated ? (
      <div className='flex flex-col space-y-3'>
        {/* Sección de bienvenida solo en móvil */}
        <div className='px-4 py-3 bg-gray-600 rounded-md'>
          <p className='text-gray-200 font-medium text-center'>
            Bienvenido, <span className='text-white'>{user.username}</span>
          </p>
          {user?.role === 'admin' && (
            <p className='text-red-400 text-center text-sm mt-1'>
              (Cuenta de administrador)
            </p>
          )}
        </div>
        
        {user?.role === 'admin' && (
          <>
            <MobileNavButton to="/admin" text="Panel Admin" setIsOpen={setIsOpen} />
            <MobileNavButton to="/admin/classes" text="Clases" setIsOpen={setIsOpen} />
          </>
        )}
        
        {user?.role !== 'admin' && user?.subscription?.active && (
          <MobileNavButton 
            to='/classes' 
            text="Añadir asistencia" 
            setIsOpen={setIsOpen}
          />
        )}
        
        <MobileNavButton to='/tasks' text="Ir al Inicio" setIsOpen={setIsOpen} />
        <MobileNavButton to='/profile' text="Ir al perfil" setIsOpen={setIsOpen} />
        
        <button
          onClick={() => {
            logout();
            setIsOpen(false);
          }}
          className='w-full text-left px-4 py-3 bg-[#EF9659] rounded-md hover:bg-[#D4874F] transition-colors flex items-center justify-between'
        >
          <span>Cerrar sesión</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    ) : (
      <div className='flex flex-col space-y-3'>
        {/* Mensaje para usuarios no autenticados */}
        <div className='px-4 py-3 bg-gray-600 rounded-md'>
          <p className='text-gray-200 font-medium text-center'>
            Bienvenido a Básquet para Adultos
          </p>
        </div>
        
        <MobileNavButton 
          to='/login' 
          text="Iniciar Sesión" 
          setIsOpen={setIsOpen}
        />
        <MobileNavButton 
          to='/register' 
          text="Registrarse" 
          setIsOpen={setIsOpen}
        />
      </div>
    );
  }
}

// Componente para botones de escritorio
const NavButton = ({ to, onClick, text, isButton = false }) => {
  const baseClasses = "px-3 py-1.5 rounded-md hover:bg-[#D4874F] transition-colors text-sm lg:text-base whitespace-nowrap flex items-center bg-[#EF9659]";
  
  return isButton ? (
    <button onClick={onClick} className={baseClasses}>
      {text}
    </button>
  ) : (
    <Link to={to} className={baseClasses}>
      {text}
    </Link>
  );
};

// Componente para botones móviles
const MobileNavButton = ({ to, onClick, text, setIsOpen }) => {
  const handleClick = () => {
    if (onClick) onClick();
    setIsOpen(false);
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className='block w-full px-4 py-3 bg-[#EF9659] rounded-md hover:bg-[#D4874F] transition-colors'
    >
      {text}
    </Link>
  );
};

export default Navbar;