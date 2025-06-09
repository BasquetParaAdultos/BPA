import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ActiveSubscriptionsTable = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedColumn, setCopiedColumn] = useState(null); // Estado para feedback visual

    useEffect(() => {
        const fetchActiveUsers = async () => {
            try {
                const response = await axios.get('/api/admin/active-subscribers');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchActiveUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.dni?.includes(searchTerm)
    );

    const copyColumnData = (columnKey) => {
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
        return format(new Date(date), 'dd/MM/yyyy', { locale: es });
    };

    // Función para crear headers con botones de copia
    const ColumnHeader = ({ title, columnKey }) => (
        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
            <button 
                onClick={() => copyColumnData(columnKey)}
                className="flex items-center hover:text-blue-300 transition-colors"
                title={`Copiar todos los ${title}`}
            >
                {title}
                {copiedColumn === columnKey && (
                    <span className="ml-2 text-green-400 text-xs">✓</span>
                )}
            </button>
        </th>
    );

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

            {filteredUsers.length === 0 && (
                <div className="mt-4 text-center text-gray-500">
                    No se encontraron usuarios con suscripción activa
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