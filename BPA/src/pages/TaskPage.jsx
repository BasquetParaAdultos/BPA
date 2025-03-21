import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Link } from 'react-router-dom';

function TaskPage() {
  
  const { user } = useAuth();
  const [paymentUrl, setPaymentUrl] = useState('');

  

  // TaskPage.jsx - handlePayment modificado
const handlePayment = async () => {
  try {
    const res = await axios.post(
      'http://localhost:3001/api/create-payment',
      { userId: user.id },
      {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    
    // Abrir checkout en nueva pestaña
    window.open(res.data.init_point, '_blank');
  } catch (error) {
    console.error("Error completo:", error.response?.data || error.message);
    alert("Error al iniciar el pago: " + (error.response?.data?.message || error.message));
  }
};

  

  return (
    <div>
      {user?.payment_status === 'paid' ? (
        <div className="mb-8 p-4 bg-green-100 rounded-lg">
          <h2 className="text-xl font-semibold text-green-800">
            ✅ Mensualidad pagada
          </h2>
          <Link 
            to="/classes"
            className="mt-4 inline-block bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600"
          >
            Registrar asistencia
          </Link>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-blue-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Pagar Mensualidad</h2>
          <button
            onClick={handlePayment}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            Pagar $5000 ARS
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskPage;