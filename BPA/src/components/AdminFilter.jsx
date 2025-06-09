// components/AdminFilter.jsx
import React from 'react';

const AdminFilter = ({ filters, setFilters }) => {
  // Opciones predefinidas para los filtros
  const subscriptionTypes = [0, 1, 2, 3, 4];
  const scheduleOptions = [
    "Lunes 7hs en Meridiano V°",
    "Lunes 21hs en El Bosque",
    "Martes 21hs en El Bosque",
    "Martes 22hs en El Bosque",
    "Miercoles 7hs en Meridiano V°",
    "Jueves 19hs en Estación Norte (Femenino)",
    "Jueves 20hs en Estación Norte (Mixto)",
    "Viernes 7hs en Meridiano V°",
    "Viernes 21hs en El Bosque",
    "Sabado 9hs en El Bosque",
    "Sabado 10hs en El Bosque",
    "Sabado 11hs en El Bosque"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMultiSelect = (e) => {
    const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setFilters(prev => ({ ...prev, schedules: options }));
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtro por nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar por nombre:
          </label>
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nombre o usuario..."
          />
        </div>

        {/* Filtro por estado de subscripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado subscripción:
          </label>
          <select
            name="activeSubscription"
            value={filters.activeSubscription}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos</option>
            <option value="active">Activa</option>
            <option value="inactive">Inactiva</option>
          </select>
        </div>

        {/* Filtro por tipo de subscripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de subscripción:
          </label>
          <select
            name="subscriptionType"
            value={filters.subscriptionType}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="any">Cualquiera</option>
            {subscriptionTypes.map(type => (
              <option key={type} value={type}>
                {type} Clases
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por horarios */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Horarios:
          </label>
          <select
            multiple
            name="schedules"
            value={filters.schedules}
            onChange={handleMultiSelect}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 h-32"
          >
            {scheduleOptions.map(schedule => (
              <option key={schedule} value={schedule}>
                {schedule}
              </option>
            ))}
          </select>
          <span className="text-xs text-gray-500">Mantén Ctrl para seleccionar múltiples</span>
        </div>
      </div>
    </div>
  );
};

export default AdminFilter;