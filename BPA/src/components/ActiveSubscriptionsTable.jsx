import { useState, useEffect } from 'react';
import axios from '../api/axios'; // Usar instancia configurada
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ActiveSubscriptionsTable = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedColumn, setCopiedColumn] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchActiveUsers = async () => {
            try {
                // ✅ Usar instancia configurada de Axios
                const response = await axios.get('/admin/active-subscribers');
                setUsers(response.data);
                setError('');
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Error al cargar usuarios con suscripción activa');
            } finally {
                setLoading(false);
            }
        };
        fetchActiveUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        return (
            user.username?.toLowerCase().includes(searchLower) ||
            user.full_name?.toLowerCase().includes(searchLower) ||
            (user.dni && user.dni.includes(searchTerm))
        );
    });

    const copyColumnData = (columnKey) => {
        if (filteredUsers.length === 0) return;
        
        let columnData = [];
        
        switch(columnKey) {
            case 'username':
                columnData = filteredUsers.map(user => user.username || 'Incompleto');
                break;
            case 'full_name':
                columnData = filteredUsers.map(user => user.full_name || 'Incompleto');
                break;
            case 'dni':
                columnData = filteredUsers.map(user => user.dni || 'Incompleto');
                break;
            case 'birth_date':
                columnData = filteredUsers.map(user => 
                    user.birth_date ? 
                    format(new Date(user.birth_date), 'dd/MM/yyyy', { locale: es }) : 
                    'Incompleto'
                );
                break;
            case 'expiresAt':
                columnData = filteredUsers.map(user => 
                    user.subscription?.expiresAt ? 
                    format(new Date(user.subscription.expiresAt), 'dd/MM/yyyy', { locale: es }) : 
                    'Incompleto'
                );
                break;
            default:
                return;
        }

        navigator.clipboard.writeText(columnData.join('\n'))
            .then(() => {
                setCopiedColumn(columnKey);
                setTimeout(() => setCopiedColumn(null), 2000);
            })
            .catch(err => console.error('Error al copiar:', err));
    };

    const formatDate = (date) => {
        if (!date) return 'Incompleto';
        try {
            return format(new Date(date), 'dd/MM/yyyy', { locale: es });
        } catch {
            return 'Fecha inválida';
        }
    };

    // Componente para los headers de la tabla
    const ColumnHeader = ({ title, columnKey }) => (
        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
            <button 
                onClick={() => copyColumnData(columnKey)}
                className={`flex items-center transition-colors ${
                    filteredUsers.length > 0 
                        ? 'hover:text-blue-300 cursor-pointer' 
                        : 'text-gray-400 cursor-default'
                }`}
                title={`Copiar todos los ${title}`}
                disabled={filteredUsers.length === 0}
            >
                {title}
                {copiedColumn === columnKey && (
                    <span className="ml-2 text-green-400 text-xs">✓</span>
                )}
            </button>
        </th>
    );

    if (loading) {
        return (
            <div className="p-6 text-center">
                <p className="text-gray-600">Cargando usuarios...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar por usuario, nombre o DNI..."
                    className="w-full p-2 border rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {users.length > 0 ? (
                <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <ColumnHeader title="Usuario" columnKey="username" />
                                <ColumnHeader title="Nombre Completo" columnKey="full_name" />
                                <ColumnHeader title="DNI" columnKey="dni" />
                                <ColumnHeader title="Fecha Nacimiento" columnKey="birth_date" />
                                <ColumnHeader title="Expiración Sub." columnKey="expiresAt" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map(user => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.username || 'Incompleto'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.full_name || 'Incompleto'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {user.dni || 'Incompleto'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {formatDate(user.birth_date)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {user.subscription?.expiresAt ?
                                            formatDate(user.subscription.expiresAt) :
                                            'Incompleto'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No hay usuarios con suscripción activa</p>
                </div>
            )}

            {filteredUsers.length === 0 && users.length > 0 && (
                <div className="mt-4 text-center text-gray-500">
                    No se encontraron usuarios que coincidan con la búsqueda
                </div>
            )}

            {copiedColumn && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    ✓ Datos de {copiedColumn} copiados al portapapeles
                </div>
            )}
        </div>
    );
};

export default ActiveSubscriptionsTable;