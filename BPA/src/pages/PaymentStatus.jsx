// pages/PaymentStatus.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PaymentStatus() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    const checkPayment = async () => {
      await refreshUser(); // Actualiza los datos del usuario
      
      // Redirigir según el estado de la suscripción
      if (user?.subscription?.active) {
        navigate('/classes', { 
          state: { 
            message: `¡Pago exitoso! Tienes acceso a ${user.subscription.classesAllowed} clases`
          }
        });
      } else {
        navigate('/payment/failure', { 
          state: { 
            error: 'El pago no se completó correctamente' 
          }
        });
      }
    }
    
    // Verificar cada 5 segundos por cambios
    const interval = setInterval(checkPayment, 5000);
    checkPayment(); // Verificación inicial
    
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="p-4 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <h1 className="text-2xl font-bold mt-4">Verificando estado de pago...</h1>
        <p className="text-gray-600 mt-2">
          Esto puede tomar unos segundos. No cierres esta página.
        </p>
      </div>
    </div>
  );
}

export default PaymentStatus;