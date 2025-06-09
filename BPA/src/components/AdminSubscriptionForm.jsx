import { useState, useEffect } from 'react';
import axios from '../api/axios'; // Usar instancia configurada
import { useAuth } from '../context/AuthContext';

const AdminSubscriptionForm = ({ user }) => {
    const { refreshUser } = useAuth();
    const [activeOption, setActiveOption] = useState(null);
    const [selectedSchedules, setSelectedSchedules] = useState([]);
    const [showScheduleOptions, setShowScheduleOptions] = useState(false);
    const [message, setMessage] = useState('');
    const [isCanceling, setIsCanceling] = useState(false);
    const [isEditingExpiration, setIsEditingExpiration] = useState(false);
    const [newExpirationDate, setNewExpirationDate] = useState('');

    // Horarios disponibles
    const scheduleOptions = [
        "Lunes 7hs en Meridiano V°",
        "Lunes 20hs en El Bosque",
        "Lunes 21hs en El Bosque",
        "Martes 21hs en El Bosque",
        "Martes 22hs en El Bosque",
        "Miércoles 7hs en Meridiano V°",
        "Jueves 19hs en Estación Norte (Femenino)",
        "Jueves 20hs en Estación Norte (Mixto)",
        "Viernes 7hs en Meridiano V°",
        "Viernes 21hs en El Bosque",
        "Sábado 9hs en El Bosque",
        "Sábado 10:30hs en El Bosque"
    ];

    // Opciones de suscripción
    const options = [
        { id: 1, label: '1 clase por semana' },
        { id: 2, label: '2 clases por semana' },
        { id: 3, label: '3 clases por semana' },
        { id: 4, label: '4 clases por semana' },
    ];

    // Inicializar con valores existentes
    useEffect(() => {
        if (user?.subscription?.active) {
            setActiveOption(user.subscription.classesAllowed);
            setSelectedSchedules(user.subscription.selectedSchedules || []);
        }
    }, [user]);

    // Manejar selección de horarios
    const toggleSchedule = (schedule) => {
        setSelectedSchedules(prev =>
            prev.includes(schedule)
                ? prev.filter(s => s !== schedule)
                : [...prev, schedule]
        );
    };

    // Eliminar horario seleccionado
    const removeSchedule = (index) => {
        setSelectedSchedules(prev => prev.filter((_, i) => i !== index));
    };

    // Asignar nueva suscripción
    const handleAssignSubscription = async () => {
        try {
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 30);

            // Crear objeto de suscripción
            const subscriptionData = {
                subscription: {
                    active: true,
                    classesAllowed: activeOption,
                    selectedSchedules,
                    startDate: new Date().toISOString(),
                    expiresAt: expirationDate.toISOString()
                }
            };

            // ✅ Usar instancia configurada de Axios
            await axios.put(`/admin/update-subscription/${user._id}`, subscriptionData);

            await refreshUser();
            setMessage('Suscripción asignada exitosamente!');
            setTimeout(() => setMessage(''), 3000);
            setActiveOption(null);
            setSelectedSchedules([]);

        } catch (error) {
            console.error('Error:', error);
            setMessage(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    // Cancelar suscripción
    const handleCancelSubscription = async () => {
        setIsCanceling(true);
        try {
            // ✅ Usar instancia configurada de Axios
            await axios.put(`/admin/update-subscription/${user._id}`, {
                subscription: {
                    active: false,
                    classesAllowed: 0,
                    selectedSchedules: [],
                    startDate: null,
                    expiresAt: null
                }
            });

            await refreshUser();
            setMessage('Suscripción anulada exitosamente!');
            setTimeout(() => setMessage(''), 3000);
            setActiveOption(null);
            setSelectedSchedules([]);
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error al anular suscripción');
        } finally {
            setIsCanceling(false);
        }
    };

    // Actualizar fecha de expiración
    const handleUpdateExpiration = async () => {
        try {
            if (!newExpirationDate) {
                setMessage('Fecha inválida');
                return;
            }

            // Convertir a UTC manteniendo campos existentes
            const subscriptionUpdate = {
                ...user.subscription,
                expiresAt: newExpirationDate
            };

            // ✅ Usar instancia configurada de Axios
            await axios.put(`/admin/update-subscription/${user._id}`, {
                subscription: subscriptionUpdate
            });

            await refreshUser();
            setMessage('Fecha actualizada exitosamente!');
            setIsEditingExpiration(false);
        } catch (error) {
            setMessage('Error: ' + (error.response?.data?.message || error.message));
        }
    };

    // Formatear fecha para mostrar
    const formatExpirationDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);

        if (isNaN(date)) return 'Fecha inválida';

        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Administrar Suscripción</h2>

            {/* Estado de suscripción activa */}
            {user?.subscription?.active && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h3 className="font-semibold text-blue-800">Suscripción Activa</h3>
                            {isEditingExpiration ? (
                                <div className="mt-2 flex flex-col md:flex-row gap-2 items-start">
                                    <input
                                        type="datetime-local"
                                        value={newExpirationDate ||
                                            (user.subscription?.expiresAt ?
                                                new Date(user.subscription.expiresAt).toISOString().slice(0, 16) : '')}
                                        onChange={(e) => {
                                            const localDate = new Date(e.target.value);
                                            const utcDate = new Date(localDate.getTime() - (localDate.getTimezoneOffset() * 60000));
                                            setNewExpirationDate(utcDate.toISOString());
                                        }}
                                        className="p-2 border rounded"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleUpdateExpiration}
                                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                        >
                                            Confirmar
                                        </button>
                                        <button
                                            onClick={() => setIsEditingExpiration(false)}
                                            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm text-blue-700">
                                        Vence el: {formatExpirationDate(user.subscription.expiresAt)}
                                    </p>
                                    <p className="text-sm text-blue-700">
                                        Inició el: {formatExpirationDate(user.subscription.startDate)}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 mt-2 md:mt-0">
                            <button
                                onClick={() => {
                                    setNewExpirationDate(user.subscription.expiresAt);
                                    setIsEditingExpiration(true);
                                }}
                                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-medium"
                            >
                                Cambiar Fecha
                            </button>
                            <button
                                onClick={handleCancelSubscription}
                                disabled={isCanceling}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                            >
                                {isCanceling ? 'Anulando...' : 'Anular Suscripción'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Formulario de suscripción */}
            <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden mb-4">
                {/* Selección de paquete */}
                <div className="flex-1 p-6 space-y-4 border-r border-gray-200">
                    <h3 className="text-lg font-semibold">Tipo de suscripción</h3>
                    <div className="space-y-2">
                        {options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => {
                                    setActiveOption(option.id);
                                    setSelectedSchedules([]);
                                }}
                                className={`w-full text-left p-4 rounded-lg transition-all ${activeOption === option.id
                                        ? 'bg-[#EF9659] text-white shadow-md'
                                        : 'hover:bg-gray-100'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Selección de horarios */}
                <div className="flex-1 p-6 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4">Horarios asignados</h3>

                    <div className="mb-4">
                        <div className="flex flex-wrap gap-2 mb-3">
                            {selectedSchedules.map((schedule, index) => (
                                <div key={index} className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                                    <span className="text-sm">{schedule}</span>
                                    <button
                                        onClick={() => removeSchedule(index)}
                                        className="ml-2 text-blue-500 hover:text-blue-700"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowScheduleOptions(!showScheduleOptions)}
                            className={`w-full py-2 px-4 text-left bg-white border-2 rounded-lg ${selectedSchedules.length === activeOption
                                    ? 'border-green-500'
                                    : 'border-red-500'
                                }`}
                            disabled={selectedSchedules.length === activeOption}
                        >
                            {selectedSchedules.length > 0
                                ? `${selectedSchedules.length} de ${activeOption} seleccionados`
                                : "Seleccionar horarios"}
                        </button>

                        {showScheduleOptions && (
                            <div className="mt-2 border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                                {scheduleOptions.map((schedule, index) => (
                                    <div
                                        key={index}
                                        className={`p-3 cursor-pointer ${selectedSchedules.includes(schedule)
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'hover:bg-gray-100'
                                            } ${selectedSchedules.length >= activeOption &&
                                                !selectedSchedules.includes(schedule)
                                                ? 'opacity-50 cursor-not-allowed'
                                                : ''
                                            }`}
                                        onClick={() => {
                                            if (selectedSchedules.length < activeOption ||
                                                selectedSchedules.includes(schedule)) {
                                                toggleSchedule(schedule);
                                            }
                                        }}
                                    >
                                        <div className="flex items-center">
                                            <span className={`mr-2 ${selectedSchedules.includes(schedule)
                                                    ? 'text-blue-500'
                                                    : 'text-transparent'
                                                }`}>
                                                ✓
                                            </span>
                                            {schedule}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleAssignSubscription}
                        className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
                        disabled={selectedSchedules.length !== activeOption}
                    >
                        Asignar Suscripción
                    </button>
                </div>
            </div>

            {/* Mensajes de estado */}
            {message && (
                <div className={`mt-4 p-3 rounded-lg ${message.includes('exitosamente')
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default AdminSubscriptionForm;