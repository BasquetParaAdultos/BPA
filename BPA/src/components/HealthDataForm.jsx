import React from 'react';

const HealthDataForm = ({ formData, onDataChange }) => {
  // Función para manejar cambios en campos condicionales
  const handleConditionalChange = (field, value) => {
    const changes = {
      [field]: value
    };
    
    // Resetear campos dependientes si se cambia a "No"
    if (value === false) {
      changes[`${field}_details`] = '';
      changes[`${field}_info`] = '';
    }
    
    onDataChange(changes);
  };

  // Manejar cambios en campos normales
  const handleChange = (name, value) => {
    onDataChange({ [name]: value });
  };

  // Componente reutilizable para campos Sí/No
  const YesNoField = ({ label, field }) => (
    <div>
      <label className="block text-gray-700 mb-2">{label}</label>
      <select
        value={formData[field]}
        onChange={(e) => handleConditionalChange(field, e.target.value === 'true')}
        className="w-full p-2 border rounded"
      >
        <option value={false}>No</option>
        <option value={true}>Sí</option>
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Sección Datos Generales */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-bold mb-4">Datos Generales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Teléfono alternativo 1</label>
            <input
              type="tel"
              value={formData.alternate_phone1}
              onChange={(e) => handleChange('alternate_phone1', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-gray-700">Teléfono alternativo 2</label>
            <input
              type="tel"
              value={formData.alternate_phone2}
              onChange={(e) => handleChange('alternate_phone2', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700">DNI</label>
            <input
              type="text"
              value={formData.dni}
              onChange={(e) => handleChange('dni', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700">Localidad</label>
            <input
              type="text"
              value={formData.locality}
              onChange={(e) => handleChange('locality', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700">Nacionalidad</label>
            <input
              type="text"
              value={formData.nationality}
              onChange={(e) => handleChange('nationality', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700">Fecha de Nacimiento</label>
            <input
              type="date"
              value={formData.birth_date ? new Date(formData.birth_date).toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const dateString = e.target.value;
                const isoDate = dateString ? new Date(dateString).toISOString() : null;
                handleChange('birth_date', isoDate);
              }}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700">Sexo</label>
            <select
              value={formData.sex}
              onChange={(e) => handleChange('sex', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccionar</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Domicilio</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700">Obra Social</label>
            <input
              type="text"
              value={formData.health_insurance}
              onChange={(e) => handleChange('health_insurance', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700">Grupo Sanguíneo</label>
            <select
              value={formData.blood_type}
              onChange={(e) => handleChange('blood_type', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccionar</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sección Antecedentes de Salud */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-bold mb-4">Antecedentes de Salud</h2>
        <div className="space-y-4">
          <YesNoField label="¿Tiene enfermedades crónicas?" field="chronic_diseases" />
          {formData.chronic_diseases && (
            <div>
              <label className="block text-gray-700">Especifique cuales</label>
              <input
                type="text"
                value={formData.diseases_details}
                onChange={(e) => handleChange('diseases_details', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          <YesNoField label="¿Recibe atención médica regular?" field="medical_care" />
          
          <div>
            <label className="block text-gray-700">Medicación actual</label>
            <input
              type="text"
              value={formData.medication}
              onChange={(e) => handleChange('medication', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <YesNoField label="¿Tiene el calendario de vacunación completo?" field="vaccination_complete" />

          <div>
            <label className="block text-gray-700">Alergias</label>
            <input
              type="text"
              value={formData.allergies}
              onChange={(e) => handleChange('allergies', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <YesNoField label="¿Padece diabetes?" field="diabetes" />
          <YesNoField label="¿Tiene alguna discapacidad?" field="disability" />

          <div>
            <label className="block text-gray-700">Información adicional importante</label>
            <textarea
              value={formData.additional_info}
              onChange={(e) => handleChange('additional_info', e.target.value)}
              className="w-full p-2 border rounded h-32"
              placeholder="Información relevante para emergencias..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthDataForm;