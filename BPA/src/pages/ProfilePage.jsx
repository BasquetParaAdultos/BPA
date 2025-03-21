import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';


function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        phone: '',
        full_name: '',
        description: '',
        profile_picture: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                phone: user.phone || '',
                full_name: user.full_name || '',
                description: user.description || '',
                profile_picture: user.profile_picture || ''
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:3001/api/update', formData, {
                withCredentials: true, // Envía cookies automáticamente
               
            });
            await refreshUser();
            setIsEditing(false);
        } catch (error) {
            console.error("Error al actualizar:", error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Perfil de {user?.username}</h1>
            
            <div className="bg-white rounded-lg shadow-md p-6">
                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700">Foto de perfil (URL)</label>
                            <input
                                type="text"
                                value={formData.profile_picture}
                                onChange={(e) => setFormData({...formData, profile_picture: e.target.value})}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700">Nombre completo</label>
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700">Teléfono</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700">Descripción</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="w-full p-2 border rounded h-32"
                            />
                        </div>
                        
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Guardar
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
                        {user?.profile_picture && (
                            <img 
                                src={user.profile_picture} 
                                alt="Perfil" 
                                className="w-32 h-32 rounded-full mx-auto"
                            />
                        )}
                        
                        <div>
                            <h2 className="text-xl font-semibold">{user?.full_name || 'Sin nombre completo'}</h2>
                            <p className="text-gray-600">{user?.email}</p>
                        </div>
                        
                        <div>
                            <p className="text-gray-600">
                                <span className="font-semibold">Teléfono:</span> {user?.phone || 'No especificado'}
                            </p>
                        </div>
                        
                        <div>
                            <p className="text-gray-600">
                                <span className="font-semibold">Descripción:</span> {user?.description || 'Sin descripción'}
                            </p>
                        </div>
                        
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Editar Perfil
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;