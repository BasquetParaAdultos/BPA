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
        const res = await axios.get('/api/classes', {
          withCredentials: true
        });
        const data = Array.isArray(res.data) ? res.data : [];
        setClasses(data);
      } catch (error) {
        console.error("Error cargando clases:", error);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleAttendance = async (classId, attended) => {
    try {
      const res = await axios.put(
        `/api/classes/${classId}/attendance`,
        { attended },
        { withCredentials: true }
      );
      setClasses(prev => prev.map(c => c._id === classId ? res.data : c));
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
    }
  };

  if (loading) return <div className="p-4">Cargando...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Clases Disponibles</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.map(cls => {
          const userAttendance = (cls.attendees || []).find(a => 
            a.user?._id === user?.id
          );

          return (
            <div key={cls._id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg">
                {new Date(cls.date).toLocaleDateString('es-AR')} - {cls.schedule}
              </h3>
              <div className="mt-2">
                <button
                  onClick={() => handleAttendance(cls._id, true)}
                  className={`mr-2 px-4 py-2 rounded ${
                    userAttendance?.attended === true 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200'
                  }`}
                >
                  Asistiré
                </button>
                <button
                  onClick={() => handleAttendance(cls._id, false)}
                  className={`px-4 py-2 rounded ${
                    userAttendance?.attended === false 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-200'
                  }`}
                >
                  No asistiré
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ClassesPage;