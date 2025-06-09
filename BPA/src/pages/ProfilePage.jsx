import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import HealthDataForm from '../components/HealthDataForm.jsx';
import HealthDataView from '../components/HealthDataView.jsx';
import { useParams } from 'react-router-dom';
import AdminSubscriptionForm from '../components/AdminSubscriptionForm.jsx';
import axios from '../api/axios';

function ProfilePage() {
    const { userId } = useParams();
    const { user: currentUser, refreshUser, initialLoading } = useAuth();
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
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/user/${userId}`, {
                        withCredentials: true,
                        headers: { 'Content-Type': 'application/json' }
                    });
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
                // ... otros campos
            });
        }
    }, [userToDisplay, isEditing]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Usa la instancia de axios configurada (no axios directo)
            const response = await axios.put('/update', formData, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('Perfil actualizado:', response.data);
            // Actualizar datos del usuario después de editar
            await refreshUser();
            setIsEditing(false);
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
        }
    };

    // Función para manejar cambios en el formulario de datos de salud
    const handleHealthDataChange = (newData) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    if (loadingProfile || initialLoading || (isViewingOtherProfile && !viewedUser)) {
        return (
            <div className="max-w-2xl mx-auto p-6 text-center">
                <p className="text-gray-600">Cargando perfil...</p>
            </div>
        );
    }

    if (!userToDisplay) {
        return (
            <div className="max-w-2xl mx-auto p-6 text-center">
                <p className="text-red-500">Error: Usuario no encontrado</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">
                Perfil de {userToDisplay.username}
                {userToDisplay.role === 'admin' && (
                    <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded">ADMIN</span>
                )}
            </h1>

            <div className="bg-white rounded-lg shadow-md p-6">
                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Campos básicos */}
                            <div>
                                <label className="block text-gray-700">Nombre completo</label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            {/* ... otros campos básicos ... */}
                        </div>

                        {/* Incorpora el HealthDataForm con el nuevo manejador */}
                        <HealthDataForm
                            formData={formData}
                            onDataChange={handleHealthDataChange}
                        />

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Guardar Cambios
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        {userToDisplay.profile_picture && (
                            <img
                                src={userToDisplay.profile_picture}
                                alt="Perfil"
                                className="w-32 h-32 rounded-full mx-auto"
                            />
                        )}

                        <div>
                            <h2 className="text-xl font-semibold">
                                {userToDisplay.full_name || 'Sin nombre completo'}
                            </h2>
                            <p className="text-gray-600">{userToDisplay.email}</p>
                        </div>

                        <div>
                            <p className="text-gray-600">
                                <span className="font-semibold">Teléfono:</span>
                                {userToDisplay.phone || 'No especificado'}
                            </p>
                        </div>

                        <HealthDataView user={userToDisplay} />

                        {!isViewingOtherProfile && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Editar Perfil
                            </button>
                        )}
                    </div>
                )}
            </div>

            {currentUser?.role === 'admin' && isViewingOtherProfile && (
                <AdminSubscriptionForm user={userToDisplay} />
            )}
        </div>
    );
}

export default ProfilePage;