// pages/AdminPage.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

function AdminPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/admin/users', {
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

    // Función para formatear la fecha
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    return (
        <div className="p-4 min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Usuarios Registrados</h1>

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
                                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Fecha de Registro</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <Link
                                            to={`/profile/${user._id}`}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            {user.username}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {formatDate(user.createdAt)}
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