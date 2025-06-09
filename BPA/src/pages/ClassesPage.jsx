import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Función para verificar validez de la suscripción
  const isSubscriptionValid = () => {
    return user?.subscription?.active &&
      new Date(user.subscription.expiresAt) > new Date();
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        if (!isSubscriptionValid()) {
          setClasses([]);
          setLoading(false);
          return;
        }

        // ✅ Usar instancia configurada de Axios
        const res = await axios.get('/classes');
        setClasses(res.data);
      } catch (error) {
        console.error("Error:", error);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [user]);

  const handleAttendance = async (classId, attended) => {
    try {
      // ✅ Usar instancia configurada de Axios
      const res = await axios.put(
        `/classes/${classId}/attendance`,
        { attended }
      );

      setClasses(prev => prev.map(c =>
        c._id === classId ? {
          ...c,
          attendees: res.data.attendees
        } : c
      ));
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
      alert("Error al actualizar asistencia: " + (error.response?.data?.message || error.message));
    }
  };

  // Formatear fechas
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EF9659] mb-4"></div>
          <p>Cargando clases...</p>
        </div>
      </div>
    );
  }

  if (!isSubscriptionValid()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {user?.subscription?.active
              ? "Tu suscripción ha expirado"
              : "Acceso restringido"}
          </h2>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-3">
              {user?.subscription?.active
                ? "Renueva tu suscripción para seguir accediendo a las clases."
                : "Necesitas una suscripción activa para ver las clases."}
            </p>
            
            {user?.subscription?.expiresAt && (
              <p className="text-gray-600">
                Fecha de expiración: {new Date(user.subscription.expiresAt).toLocaleDateString('es-AR')}
              </p>
            )}
          </div>
          
          <Link 
            to="/tasks" 
            className="inline-block bg-[#EF9659] text-white px-6 py-3 rounded-lg hover:bg-[#D4874F] transition-colors"
          >
            Ver opciones de suscripción
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Tus Clases Programadas</h1>

      <div className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-2 md:mb-0">
          <p className="text-blue-800 font-medium">
            Clases disponibles: <span className="font-bold">{user.subscription.classesAllowed}</span>
          </p>
          <p className="text-blue-800">
            Vence: {new Date(user.subscription.expiresAt).toLocaleDateString('es-AR')}
          </p>
        </div>
        
        <div className="flex gap-2">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Asistiré</span>
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">No asistiré</span>
        </div>
      </div>

      {classes.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">No tienes clases asignadas</h3>
          <p className="text-gray-600 mb-4">
            Tu profesor asignará clases próximamente según tu suscripción
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {user.subscription.selectedSchedules?.map((schedule, i) => (
              <span key={i} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {schedule}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classes.map(cls => {
            const userAttendance = cls.attendees?.find(a => a.user?._id === user.id);
            const isFutureClass = new Date(cls.date) > new Date();

            return (
              <div key={cls._id} className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-1">
                    {formatDate(cls.date)}
                  </h3>
                  <p className="text-gray-600 font-medium">{cls.schedule}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAttendance(cls._id, true)}
                    disabled={isFutureClass}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      userAttendance?.attended === true
                        ? 'bg-green-500 text-white shadow-inner'
                        : isFutureClass
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 hover:bg-green-100 border border-green-300 text-green-700'
                    }`}
                  >
                    Asistiré
                  </button>
                  
                  <button
                    onClick={() => handleAttendance(cls._id, false)}
                    disabled={isFutureClass}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      userAttendance?.attended === false
                        ? 'bg-red-500 text-white shadow-inner'
                        : isFutureClass
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 hover:bg-red-100 border border-red-300 text-red-700'
                    }`}
                  >
                    No asistiré
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ClassesPage;