// pages/admin/AdminClassesPage.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function AdminClassesPage() {
  const [classes, setClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();
  const itemsPerPage = 12; // Clases por página

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(`/api/admin/classes?page=${currentPage}&limit=${itemsPerPage}`, {
          withCredentials: true
        });
        setClasses(res.data.classes);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error("Error cargando clases:", error);
      }
    };
    fetchClasses();
  }, [currentPage]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Registro de Clases</h1>
      
      {/* Paginación */}
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

      {/* Listado de Clases */}
      {classes.map(cls => (
        <div key={cls._id} className="mb-8 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">
            {new Date(cls.date).toLocaleDateString('es-AR')} - {cls.schedule}
            <span className="ml-2 text-sm text-gray-600">
              ({cls.attendees.length} participantes)
            </span>
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Usuario</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Asistencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cls.attendees.map(attendee => (
                  <tr key={attendee.user._id}>
                    <td className="px-6 py-4">{attendee.user.username}</td>
                    <td className="px-6 py-4">{attendee.user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded ${attendee.attended ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {attendee.attended ? 'Asistió' : 'No asistió'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminClassesPage;