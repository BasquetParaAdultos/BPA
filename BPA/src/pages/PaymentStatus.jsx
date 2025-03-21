// pages/PaymentStatus.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PaymentStatus() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    const checkPayment = async () => {
      await refreshUser(); // <-- Forza la actualización
    }
    checkPayment();
  }, [user]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Verificando estado de pago...</h1>
    </div>
  );
}

export default PaymentStatus;