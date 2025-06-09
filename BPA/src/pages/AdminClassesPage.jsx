import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

function AdminClassesPage() {
  const [classes, setClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        setError('');
        
        // ✅ Usar instancia configurada de Axios
        const res = await axios.get(`/admin/classes?page=${currentPage}&limit=${itemsPerPage}`);
        
        setClasses(res.data.classes);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error("Error cargando clases:", error);
        setError('Error al cargar las clases. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClasses();
  }, [currentPage]);

  // Función para formatear fechas
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  // Componente de paginación
  const PaginationControls = () => (
    <div className="flex justify-between items-center mb-6">
      <button
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1 || loading}
        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Anterior
      </button>
      
      <div className="flex items-center gap-2">
        <span className="text-gray-700">Página {currentPage} de {totalPages}</span>
        {totalPages > 1 && (
          <select 
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            className="border rounded p-1"
            disabled={loading}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>
        )}
      </div>
      
      <button
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages || loading}
        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Siguiente
      </button>
    </div>
  );

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

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Registro de Clases</h1>
        <div className="text-sm text-gray-600">
          {classes.length > 0 && `Mostrando ${classes.length} de ${itemsPerPage} por página`}
        </div>
      </div>

      <PaginationControls />

      {classes.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">No hay clases registradas</h3>
          <p className="text-gray-600">
            Aún no se han creado clases o no hay registros para mostrar
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {classes.map(cls => {
            const attendeesCount = cls.attendees.length;
            const attendedCount = cls.attendees.filter(a => a.attended).length;
            const notAttendedCount = attendeesCount - attendedCount;

            return (
              <div key={cls._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gray-50 p-4 border-b">
                  <h2 className="text-xl font-semibold">
                    {formatDate(cls.date)} - {cls.schedule}
                  </h2>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                      Asistieron: {attendedCount}
                    </span>
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                      No asistieron: {notAttendedCount}
                    </span>
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-gray-400 rounded-full mr-1"></span>
                      Total: {attendeesCount}
                    </span>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuario
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Asistencia
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cls.attendees.map((attendee, index) => (
                        <tr key={`${cls._id}-${index}`} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {attendee.user?.username || 'Usuario eliminado'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {attendee.user?.email || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              attendee.attended 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {attendee.attended ? 'Asistió' : 'No asistió'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <PaginationControls />
    </div>
  );
}

export default AdminClassesPage;