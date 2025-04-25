import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import HealthDataForm from '../components/HealthDataForm.jsx';
import HealthDataView from '../components/HealthDataView.jsx';
import { useParams } from 'react-router-dom';

function ProfilePage() {
    const { userId } = useParams();
    const { user: currentUser, refreshUser } = useAuth();
    const [viewedUser, setViewedUser] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    const isViewingOtherProfile = !!userId;
    const userToDisplay = isViewingOtherProfile ? viewedUser : currentUser;

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

    // Cargar datos del usuario
    useEffect(() => {
        if (isViewingOtherProfile) {
            const fetchUser = async () => {
                try {
                    setLoadingProfile(true);
                    const res = await axios.get(`http://localhost:3001/api/auth/profile/${userId}`, {
                        withCredentials: true
                    });
                    setViewedUser(res.data);
                } catch (error) {
                    console.error("Error al cargar usuario:", error);
                } finally {
                    setLoadingProfile(false);
                }
            };
            fetchUser();
        } else {
            setLoadingProfile(false);
        }
    }, [userId, isViewingOtherProfile]);

    // Actualizar formulario cuando cambian los datos del usuario
    useEffect(() => {
        if (userToDisplay) {
            setFormData({
                phone: userToDisplay.phone || '',
                full_name: userToDisplay.full_name || '',
                description: userToDisplay.description || '',
                profile_picture: userToDisplay.profile_picture || '',
                alternate_phone1: userToDisplay.alternate_phone1 || '',
                alternate_phone2: userToDisplay.alternate_phone2 || '',
                dni: userToDisplay.dni || '',
                locality: userToDisplay.locality || '',
                nationality: userToDisplay.nationality || '',
                birth_date: userToDisplay.birth_date || '',
                sex: userToDisplay.sex || '',
                address: userToDisplay.address || '',
                health_insurance: userToDisplay.health_insurance || '',
                blood_type: userToDisplay.blood_type || '',
                chronic_diseases: userToDisplay.chronic_diseases || false,
                diseases_details: userToDisplay.diseases_details || '',
                medical_care: userToDisplay.medical_care || false,
                medication: userToDisplay.medication || '',
                vaccination_complete: userToDisplay.vaccination_complete || false,
                allergies: userToDisplay.allergies || '',
                eye_diseases: userToDisplay.eye_diseases || '',
                cardiovascular_diseases: userToDisplay.cardiovascular_diseases || '',
                neurological_diseases: userToDisplay.neurological_diseases || '',
                hearing_diseases: userToDisplay.hearing_diseases || '',
                diabetes: userToDisplay.diabetes || false,
                disability: userToDisplay.disability || false,
                additional_info: userToDisplay.additional_info || ''
            });
        }
    }, [userToDisplay]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('http://localhost:3001/api/update', formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('Respuesta del servidor:', response.data);
            await refreshUser();
            setIsEditing(false);
        } catch (error) {
            console.error("Error completo:", {
                message: error.message,
                request: error.request,
                response: error.response?.data
            });
        }
    };

    if (loadingProfile) {
        return (
            <div className="max-w-2xl mx-auto p-6 text-center">
                <p className="text-gray-600">Cargando perfil...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">
                Perfil de {userToDisplay?.username || 'Usuario no encontrado'}
                {userToDisplay?.role === 'admin' && (
                    <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded">ADMIN</span>
                )}
            </h1>

            <div className="bg-white rounded-lg shadow-md p-6">
                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* ... (mantener mismo formulario) ... */}
                    </form>
                ) : (
                    <div className="space-y-4">
                        {userToDisplay?.profile_picture && (
                            <img 
                                src={userToDisplay.profile_picture} 
                                alt="Perfil" 
                                className="w-32 h-32 rounded-full mx-auto"
                            />
                        )}

                        <div>
                            <h2 className="text-xl font-semibold">
                                {userToDisplay?.full_name || 'Sin nombre completo'}
                            </h2>
                            <p className="text-gray-600">{userToDisplay?.email}</p>
                        </div>

                        <div>
                            <p className="text-gray-600">
                                <span className="font-semibold">Teléfono:</span> 
                                {userToDisplay?.phone || 'No especificado'}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-600">
                                <span className="font-semibold">Descripción:</span> 
                                {userToDisplay?.description || 'Sin descripción'}
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
        </div>
    );
}

export default ProfilePage;