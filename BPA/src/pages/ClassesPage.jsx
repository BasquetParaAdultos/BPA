import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Función simplificada para verificar suscripción activa
  const isSubscriptionActive = () => {
    return user?.subscription?.active;
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        
        // Verificar si hay usuario y suscripción activa
        if (!user || !isSubscriptionActive()) {
          setClasses([]);
          setLoading(false);
          return;
        }

        const res = await axios.get('/classes');
        
        // Filtrado por horarios seleccionados
        const filteredClasses = res.data.filter(cls => 
          user.subscription.selectedSchedules.includes(cls.schedule)
        );
        
        // Ordenar por fecha (más reciente primero)
        const sortedClasses = [...filteredClasses].sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        
        setClasses(sortedClasses);
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

  // Formatear fechas con ajuste de zona horaria
  const formatDate = (dateString) => {
    try {
      // Ajustar a zona horaria de Argentina (UTC-3)
      const date = new Date(dateString);
      date.setHours(date.getHours() - 3);
      
      return date.toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  // Formatear fecha de suscripción
 const formatSubscriptionDate = (dateString) => {
  if (!dateString) return 'Fecha inválida';
  const date = new Date(dateString);
  
  if (isNaN(date)) return 'Fecha inválida';
  
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });
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

  // Verificación de suscripción activa
  if (!isSubscriptionActive()) {
    const now = new Date();
    const startDate = user?.subscription?.startDate ? new Date(user.subscription.startDate) : null;
    const expiresAt = user?.subscription?.expiresAt ? new Date(user.subscription.expiresAt) : null;
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {user?.subscription
              ? (expiresAt && expiresAt < now 
                  ? "Tu suscripción ha expirado" 
                  : startDate && startDate > now
                    ? "Tu suscripción aún no ha comenzado"
                    : "Problema con tu suscripción")
              : "Acceso restringido"}
          </h2>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-3">
              {user?.subscription
                ? (expiresAt && expiresAt < now
                    ? "Renueva tu suscripción para seguir accediendo a las clases."
                    : startDate && startDate > now
                      ? `Tu suscripción comienza el ${formatSubscriptionDate(user.subscription.startDate)}`
                      : "Por favor contacta al soporte para resolver este problema.")
                : "Necesitas una suscripción activa para ver las clases."}
            </p>
            
            {startDate && (
              <p className="text-gray-600">
                Inicio: {formatSubscriptionDate(user.subscription.startDate)}
              </p>
            )}
            
            {expiresAt && (
              <p className="text-gray-600">
                Expira: {formatSubscriptionDate(user.subscription.expiresAt)}
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

  // Separar clases pasadas y futuras
  const pastClasses = classes.filter(cls => new Date(cls.date) <= new Date());
  const futureClasses = classes.filter(cls => new Date(cls.date) > new Date());

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Tus Clases Programadas</h1>

      <div className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-2 md:mb-0">
          <p className="text-blue-800 font-medium">
            Clases disponibles: <span className="font-bold">{user.subscription.classesAllowed}</span>
          </p>
          <p className="text-blue-800">
            Inicio: {formatSubscriptionDate(user.subscription.startDate)}
          </p>
          <p className="text-blue-800">
            Vence: {formatSubscriptionDate(user.subscription.expiresAt)}
          </p>
        </div>
        
        <div className="flex gap-2">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Asistí</span>
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">No asistí</span>
        </div>
      </div>

      {classes.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">No tienes clases programadas</h3>
          <p className="text-gray-600 mb-4">
            Próximamente se asignarán clases para tus horarios seleccionados:
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
        <div className="space-y-8">
          {/* Clases Futuras */}
          {futureClasses.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-700">Próximas Clases</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {futureClasses.map(cls => {
                  const userAttendance = cls.attendees?.find(a => a.user?._id === user.id);
                  
                  return (
                    <div key={cls._id} className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                      <div className="mb-4">
                        <h3 className="font-semibold text-lg mb-1">
                          {formatDate(cls.date)}
                          <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Próxima
                          </span>
                        </h3>
                        <p className="text-gray-600 font-medium">{cls.schedule}</p>
                      </div>
                      <div className="text-center py-2">
                        <span className="text-gray-500">
                          Podrás registrar asistencia después de la clase
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Clases Pasadas */}
          {pastClasses.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-700">Clases Pasadas</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastClasses.map(cls => {
                  const userAttendance = cls.attendees?.find(a => a.user?._id === user.id);
                  
                  return (
                    <div key={cls._id} className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                      <div className="mb-4">
                        <h3 className="font-semibold text-lg mb-1">
                          {formatDate(cls.date)}
                          <span className="ml-2 text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            Pasada
                          </span>
                        </h3>
                        <p className="text-gray-600 font-medium">{cls.schedule}</p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAttendance(cls._id, true)}
                          className={`flex-1 py-2 rounded-lg transition-all ${
                            userAttendance?.attended === true
                              ? 'bg-green-500 text-white shadow-inner'
                              : 'bg-gray-100 hover:bg-green-100 border border-green-300 text-green-700'
                          }`}
                        >
                          Asistí
                        </button>
                        
                        <button
                          onClick={() => handleAttendance(cls._id, false)}
                          className={`flex-1 py-2 rounded-lg transition-all ${
                            userAttendance?.attended === false
                              ? 'bg-red-500 text-white shadow-inner'
                              : 'bg-gray-100 hover:bg-red-100 border border-red-300 text-red-700'
                          }`}
                        >
                          No asistí
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ClassesPage;