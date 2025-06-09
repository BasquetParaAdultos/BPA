import React from 'react';

const HealthDataView = ({ user }) => {
  // Función para formatear valores booleanos
  const formatYesNo = (value) => value ? 'Sí' : 'No';
  
  // Función para formatear fecha (mejorada)
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificado';
    try {
      const date = new Date(dateString);
      if (isNaN(date)) return 'Fecha inválida';
      
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('es-ES', options);
    } catch {
      return 'Fecha inválida';
    }
  };

  // Función para mostrar campos condicionales
  const renderConditionalField = (condition, label, value) => {
    return condition && value ? (
      <p className="text-gray-600">
        <span className="font-semibold">{label}:</span> {value}
      </p>
    ) : null;
  };

  return (
    <div className="space-y-6">
      {/* Sección Datos Generales */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-bold mb-4">Datos Generales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Teléfono', value: user?.phone },
            { label: 'Nombre completo', value: user?.full_name },
            { label: 'Descripción', value: user?.description },
            { label: 'Teléfono alternativo 1', value: user?.alternate_phone1 },
            { label: 'Teléfono alternativo 2', value: user?.alternate_phone2 },
            { label: 'DNI', value: user?.dni },
            { label: 'Localidad', value: user?.locality },
            { label: 'Nacionalidad', value: user?.nationality },
            { label: 'Fecha de Nacimiento', value: formatDate(user?.birth_date) },
            { 
              label: 'Sexo', 
              value: user?.sex ? user.sex.charAt(0).toUpperCase() + user.sex.slice(1) : null 
            },
            { label: 'Domicilio', value: user?.address },
            { label: 'Obra Social', value: user?.health_insurance },
            { label: 'Grupo Sanguíneo', value: user?.blood_type }
          ].map((field, index) => (
            <div key={index}>
              <p className="text-gray-600">
                <span className="font-semibold">{field.label}:</span> 
                {field.value || ' No especificado'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sección Antecedentes de Salud */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-bold mb-4">Antecedentes de Salud</h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            <span className="font-semibold">Enfermedades crónicas:</span> {formatYesNo(user?.chronic_diseases)}
          </p>
          
          {renderConditionalField(
            user?.chronic_diseases, 
            'Detalles enfermedades', 
            user?.diseases_details
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
            <span className="font-semibold">Enfermedades oculares:</span> {user?.eye_diseases || 'Ninguna'}
          </p>

          <p className="text-gray-600">
            <span className="font-semibold">Enfermedades cardiovasculares:</span> {user?.cardiovascular_diseases || 'Ninguna'}
          </p>

          <p className="text-gray-600">
            <span className="font-semibold">Enfermedades neurológicas:</span> {user?.neurological_diseases || 'Ninguna'}
          </p>

          <p className="text-gray-600">
            <span className="font-semibold">Enfermedades auditivas:</span> {user?.hearing_diseases || 'Ninguna'}
          </p>

          <p className="text-gray-600">
            <span className="font-semibold">Diabetes:</span> {formatYesNo(user?.diabetes)}
          </p>

          <p className="text-gray-600">
            <span className="font-semibold">Discapacidad:</span> {formatYesNo(user?.disability)}
          </p>

          {renderConditionalField(
            true,
            'Información adicional', 
            user?.additional_info
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthDataView;