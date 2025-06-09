// pages/AdminPage.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminFilter from '../components/AdminFilter';
import ClassAttendanceIndicator from '../components/ClassAttendanceIndicator';



function AdminPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Estado para los filtros
    const [filters, setFilters] = useState({
        name: '',
        activeSubscription: 'all',
        subscriptionType: 'any',
        schedules: []
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
                    withCredentials: true
                });
                setUsers(res.data);
            } catch (err) {
                if (err.response?.status === 403) {
                    setError("Acceso denegado: no tienes permisos de administrador");
                } else {
                    setError("Error al cargar usuarios");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Función para filtrar usuarios
    const filteredUsers = users.filter(user => {
        // Filtro por nombre
        const nameMatch = user.username.toLowerCase().includes(filters.name.toLowerCase()) ||
            user.full_name.toLowerCase().includes(filters.name.toLowerCase());

        // Filtro por estado de subscripción
        const subscriptionStatusMatch = filters.activeSubscription === 'all' ? true :
            filters.activeSubscription === 'active' ? user.subscription?.active :
                !user.subscription?.active;

        // Filtro por tipo de subscripción
        const subscriptionTypeMatch = filters.subscriptionType === 'any' ? true :
            user.subscription?.classesAllowed === Number(filters.subscriptionType);

        // Filtro por horarios
        const scheduleMatch = filters.schedules.length === 0 ? true :
            user.subscription?.selectedSchedules?.some(schedule =>
                filters.schedules.includes(schedule)
            );

        return nameMatch && subscriptionStatusMatch && subscriptionTypeMatch && scheduleMatch;
    });

    return (
        <div className="p-4 min-h-screen bg-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Usuarios Registrados</h1>
                <button
                    onClick={() => navigate('/admin/active-subscriptions')}
                    className="bg-[#EF9659] px-4 py-2 rounded-sm hover:bg-[#D4874F] transition-colors text-white"
                >
                    Ver Tabla de Seguros
                </button>
            </div>

            <AdminFilter filters={filters} setFilters={setFilters} />

            {loading ? (
                <div className="text-center py-4">
                    <p className="text-gray-600">Cargando usuarios...</p>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            ) : users.length === 0 ? (
                <p className="text-gray-600">No hay usuarios registrados.</p>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Usuario</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Nombre Completo</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Sub. Activa</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Tipo Sub.</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Horarios</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Asistencias</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map(user => (
                                <tr
                                    key={user._id}
                                    onClick={() => navigate(`/admin/user/${user._id}`)}
                                    className="hover:bg-gray-50 cursor-pointer"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {user.full_name || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {user.subscription?.active ? (
                                            <span className="text-green-600">✅</span>
                                        ) : (
                                            <span className="text-red-600">❌</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {user.subscription?.classesAllowed || 0} Clases
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="flex flex-col space-y-1 max-w-[200px]">
                                            {user.subscription?.selectedSchedules?.map((schedule, i) => (
                                                <span key={i} className="truncate">
                                                    {schedule}
                                                </span>
                                            ))}
                                            {user.subscription?.selectedSchedules?.length === 0 && '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <ClassAttendanceIndicator userId={user._id} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminPage;