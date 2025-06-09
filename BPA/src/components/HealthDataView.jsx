import React from 'react';

const HealthDataView = ({ user }) => {
  // Función para formatear valores booleanos
  const formatYesNo = (value) => value ? 'Sí' : 'No';
  
  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificado';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="space-y-6">
      {/* Sección Datos Generales */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-bold mb-4">Datos Generales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">
              <span className="font-semibold">Teléfono alternativo 1:</span> {user?.alternate_phone1 || 'No especificado'}
            </p>
          </div>
          
          <div>
            <p className="text-gray-600">
              <span className="font-semibold">Teléfono alternativo 2:</span> {user?.alternate_phone2 || 'No especificado'}
            </p>
          </div>

          <div>
            <p className="text-gray-600">
              <span className="font-semibold">DNI:</span> {user?.dni || 'No especificado'}
            </p>
          </div>

          <div>
            <p className="text-gray-600">
              <span className="font-semibold">Localidad:</span> {user?.locality || 'No especificado'}
            </p>
          </div>

          <div>
            <p className="text-gray-600">
              <span className="font-semibold">Nacionalidad:</span> {user?.nationality || 'No especificado'}
            </p>
          </div>

          <div>
            <p className="text-gray-600">
              <span className="font-semibold">Fecha de Nacimiento:</span> {formatDate(user?.birth_date)}
            </p>
          </div>

          <div>
            <p className="text-gray-600">
              <span className="font-semibold">Sexo:</span> {user?.sex ? user.sex.charAt(0).toUpperCase() + user.sex.slice(1) : 'No especificado'}
            </p>
          </div>

          <div>
            <p className="text-gray-600">
              <span className="font-semibold">Domicilio:</span> {user?.address || 'No especificado'}
            </p>
          </div>

          <div>
            <p className="text-gray-600">
              <span className="font-semibold">Obra Social:</span> {user?.health_insurance || 'No especificado'}
            </p>
          </div>

          <div>
            <p className="text-gray-600">
              <span className="font-semibold">Grupo Sanguíneo:</span> {user?.blood_type || 'No especificado'}
            </p>
          </div>
        </div>
      </div>

      {/* Sección Antecedentes de Salud */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-bold mb-4">Antecedentes de Salud</h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            <span className="font-semibold">Enfermedades crónicas:</span> {formatYesNo(user?.chronic_diseases)}
          </p>
          
          {user?.chronic_diseases && (
            <p className="text-gray-600">
              <span className="font-semibold">Detalles enfermedades:</span> {user?.diseases_details}
            </p>
          )}

          <p className="text-gray-600">
            <span className="font-semibold">Atención médica regular:</span> {formatYesNo(user?.medical_care)}
          </p>

          <p className="text-gray-600">
            <span className="font-semibold">Medicación actual:</span> {user?.medication || 'Ninguna'}
          </p>

          <p className="text-gray-600">
            <span className="font-semibold">Vacunación completa:</span> {formatYesNo(user?.vaccination_complete)}
          </p>

          <p className="text-gray-600">
            <span className="font-semibold">Alergias:</span> {user?.allergies || 'Ninguna'}
          </p>

          <p className="text-gray-600">
            <span className="font-semibold">Diabetes:</span> {formatYesNo(user?.diabetes)}
          </p>

          <p className="text-gray-600">
            <span className="font-semibold">Discapacidad:</span> {formatYesNo(user?.disability)}
          </p>

          {user?.additional_info && (
            <p className="text-gray-600">
              <span className="font-semibold">Información adicional:</span> {user.additional_info}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthDataView;