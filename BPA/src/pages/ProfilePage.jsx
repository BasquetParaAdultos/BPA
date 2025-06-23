import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import HealthDataForm from '../components/HealthDataForm.jsx';
import HealthDataView from '../components/HealthDataView.jsx';
import { useParams } from 'react-router-dom';
import AdminSubscriptionForm from '../components/AdminSubscriptionForm.jsx';
import axios from '../api/axios';

function ProfilePage() {
    const { userId } = useParams();
    const { user: currentUser, refreshUser, initialLoading, updateUser } = useAuth();
    const [viewedUser, setViewedUser] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        phone: '',
        full_name: '',
        description: '',
        profile_picture: '',
        alternate_phone1: '',
        alternate_phone2: '',
        dni: '',
        locality: '',
        nationality: '',
        birth_date: '',
        sex: '',
        address: '',
        health_insurance: '',
        blood_type: '',
        chronic_diseases: false,
        diseases_details: '',
        medical_care: false,
        medication: '',
        vaccination_complete: false,
        allergies: '',
        eye_diseases: '',
        cardiovascular_diseases: '',
        neurological_diseases: '',
        hearing_diseases: '',
        diabetes: false,
        disability: false,
        additional_info: ''
    });

    const isViewingOtherProfile = !!userId;
    const userToDisplay = isViewingOtherProfile ? viewedUser : currentUser;

    // Cargar datos del usuario
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingProfile(true);

                if (isViewingOtherProfile) {
                    // Cargar perfil de otro usuario
                    const res = await axios.get(`/admin/user/${userId}`);
                    setViewedUser(res.data);
                } else {
                    // Actualizar datos del usuario actual usando verify
                    await refreshUser();
                }
            } catch (error) {
                console.error("Error cargando perfil:", error);
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchData();
    }, [userId, isViewingOtherProfile]);

    // Actualizar formulario cuando cambian los datos del usuario
    useEffect(() => {
        if (userToDisplay && !isEditing) {
            setFormData({
                phone: userToDisplay.phone || '',
                full_name: userToDisplay.full_name || '',
                // ... otros campos (mantener igual que en el estado inicial)
            });
        }
    }, [userToDisplay, isEditing]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('/update', formData, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('Perfil actualizado:', response.data);
            updateUser(response.data);
            setIsEditing(false);
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
        }
    };

    const handleHealthDataChange = (newData) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    if (loadingProfile || initialLoading || (isViewingOtherProfile && !viewedUser)) {
        return (
            <div className="max-w-4xl mx-auto p-4 sm:p-6 text-center">
                <p className="text-gray-600">Cargando perfil...</p>
            </div>
        );
    }

    if (!userToDisplay) {
        return (
            <div className="max-w-4xl mx-auto p-4 sm:p-6 text-center">
                <p className="text-red-500">Error: Usuario no encontrado</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <span>Perfil de {userToDisplay.username}</span>
                {userToDisplay.role === 'admin' && (
                    <span className="bg-red-500 text-white text-xs sm:text-sm px-2 py-1 rounded">ADMIN</span>
                )}
            </h1>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Campos básicos */}
                            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 mb-1">Nombre completo</label>
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">Teléfono</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-32"
                                />
                            </div>
                        </div>

                        {/* Incorpora el HealthDataForm con el nuevo manejador */}
                        <HealthDataForm
                            formData={formData}
                            onDataChange={handleHealthDataChange}
                        />

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
                            >
                                Guardar Cambios
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 sm:gap-6">
                            {userToDisplay.profile_picture && (
                                <img
                                    src={userToDisplay.profile_picture}
                                    alt="Perfil"
                                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-gray-200"
                                />
                            )}

                            <div className="text-center sm:text-left">
                                <h2 className="text-xl font-semibold">
                                    {userToDisplay.full_name || 'Sin nombre completo'}
                                </h2>
                                <p className="text-gray-600">{userToDisplay.email}</p>
                                
                                <div className="mt-2">
                                    <p className="text-gray-700">
                                        <span className="font-medium">Teléfono:</span> {userToDisplay.phone || 'No especificado'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <HealthDataView user={userToDisplay} />

                        {!isViewingOtherProfile && (
                            <div className="pt-4">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                                >
                                    Editar Perfil
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {currentUser?.role === 'admin' && isViewingOtherProfile && (
                <div className="mt-6">
                    <AdminSubscriptionForm user={userToDisplay} />
                </div>
            )}
        </div>
    );
}

export default ProfilePage;