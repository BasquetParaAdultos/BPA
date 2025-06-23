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
      <div className="mb-3">
        <p className="text-gray-600">
          <span className="font-semibold">{label}:</span> {value}
        </p>
      </div>
    ) : null;
  };

  return (
    <div className="space-y-8">
      {/* Sección Datos Generales */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-bold mb-4">Datos Generales</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          {[
            { label: 'Teléfono', value: user?.phone },
            { label: 'Nombre completo', value: user?.full_name },
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
            <div key={index} className="mb-2">
              <p className="text-gray-600">
                <span className="font-semibold">{field.label}:</span> 
                {field.value ? ` ${field.value}` : ' No especificado'}
              </p>
            </div>
          ))}
          
          {/* Descripción en ancho completo */}
          {user?.description && (
            <div className="sm:col-span-2 lg:col-span-3">
              <p className="text-gray-600">
                <span className="font-semibold">Descripción:</span> {user.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sección Antecedentes de Salud */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-bold mb-4">Antecedentes de Salud</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* Columna 1 */}
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Enfermedades crónicas:</span> {formatYesNo(user?.chronic_diseases)}
              </p>
            </div>
            
            {renderConditionalField(
              user?.chronic_diseases, 
              'Detalles enfermedades', 
              user?.diseases_details
            )}

            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Atención médica regular:</span> {formatYesNo(user?.medical_care)}
              </p>
            </div>

            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Medicación actual:</span> {user?.medication || 'Ninguna'}
              </p>
            </div>

            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Vacunación completa:</span> {formatYesNo(user?.vaccination_complete)}
              </p>
            </div>

            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Alergias:</span> {user?.allergies || 'Ninguna'}
              </p>
            </div>
          </div>

          {/* Columna 2 */}
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Enfermedades oculares:</span> {user?.eye_diseases || 'Ninguna'}
              </p>
            </div>

            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Enfermedades cardiovasculares:</span> {user?.cardiovascular_diseases || 'Ninguna'}
              </p>
            </div>

            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Enfermedades neurológicas:</span> {user?.neurological_diseases || 'Ninguna'}
              </p>
            </div>

            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Enfermedades auditivas:</span> {user?.hearing_diseases || 'Ninguna'}
              </p>
            </div>

            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Diabetes:</span> {formatYesNo(user?.diabetes)}
              </p>
            </div>

            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Discapacidad:</span> {formatYesNo(user?.disability)}
              </p>
            </div>
          </div>

          {/* Información adicional en ancho completo */}
          {user?.additional_info && (
            <div className="md:col-span-2">
              <p className="text-gray-600">
                <span className="font-semibold">Información adicional:</span> {user.additional_info}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthDataView;