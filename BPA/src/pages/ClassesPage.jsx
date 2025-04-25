import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        if (!user?.subscription?.active) {
          setClasses([]);
          return;
        }
        
        const res = await axios.get('/api/classes', {
          params: { userId: user.id },
          withCredentials: true
        });
        
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
      const res = await axios.put(
        `/api/classes/${classId}/attendance`,
        { attended },
        { withCredentials: true }
      );
      
      setClasses(prev => prev.map(c => 
        c._id === classId ? { 
          ...c, 
          attendees: res.data.attendees 
        } : c
      ));
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
    }
  };

  if (loading) return <div className="p-4">Cargando...</div>;

  if (!user?.subscription?.active) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold text-red-600">
          Necesitas una suscripción activa para ver las clases
        </h2>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tus Clases Programadas</h1>
      
      <div className="mb-4 bg-blue-100 p-3 rounded-lg">
        <p className="text-blue-800">
          Clases disponibles este mes: {user.subscription.classesAllowed}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No tienes clases asignadas para este ciclo</p>
          </div>
        ) : (
          classes.map(cls => {
            const userAttendance = cls.attendees.find(a => 
              a.user?._id === user.id
            );

            return (
              <div key={cls._id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold text-lg">
                  {new Date(cls.date).toLocaleDateString('es-AR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })} - {cls.schedule}
                </h3>
                
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleAttendance(cls._id, true)}
                    className={`flex-1 py-2 rounded transition-all ${
                      userAttendance?.attended === true
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    Asistiré
                  </button>
                  <button
                    onClick={() => handleAttendance(cls._id, false)}
                    className={`flex-1 py-2 rounded transition-all ${
                      userAttendance?.attended === false
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    No asistiré
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ClassesPage;