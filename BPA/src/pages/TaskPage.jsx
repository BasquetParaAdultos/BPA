import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';
import logo from "/images/home/logoBPA.png"
import axios from '../api/axios';

function TaskPage() {
  const { user } = useAuth();
  const [showScheduleOptions, setShowScheduleOptions] = useState(false);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [activeOption, setActiveOption] = useState(1);

  // Opciones actualizadas con precios numéricos y formato de moneda
  const options = [
    { id: 1, label: '1 clase', description: 'Clase individual', price: 24000 },
    { id: 2, label: '2 clases', description: 'Pack de dos clases', price: 32000 },
    { id: 3, label: '3 clases', description: 'Entrenamiento regular', price: 40000 },
    { id: 4, label: '4 clases', description: 'Entrenamiento intensivo', price: 46000 },
  ];

  const selectedOption = options.find(opt => opt.id === activeOption);

  const toggleSchedule = (schedule) => {
    if (selectedSchedules.includes(schedule)) {
      setSelectedSchedules(prev => prev.filter(s => s !== schedule));
    } else {
      if (selectedSchedules.length < activeOption) {
        setSelectedSchedules(prev => [...prev, schedule]);
      }
    }
  };

  const removeSchedule = (index) => {
    setSelectedSchedules(prev => prev.filter((_, i) => i !== index));
  };

  const handlePayment = async () => {
    try {
      // Validación de horarios seleccionados
      if (selectedSchedules.length !== activeOption) {
        alert(`Debe seleccionar exactamente ${activeOption} horarios`);
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/create-payment`,
        {
          userId: user.id,
          option: activeOption,
          schedules: selectedSchedules,
          price: selectedOption.price
        },
        {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      window.open(res.data.init_point, '_blank');
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Error al iniciar el pago: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <>
      {/* Nuevo encabezado "Próximamente..." */}
      <div className="text-center py-10 bg-[#EF9659] text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Próximamente...</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Estamos trabajando en la implementación de nuestro sistema de pagos
        </p>
      </div>

      <section className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Contenido de texto - Izquierda */}
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center md:text-left mb-8">
              Cuota BPA
            </h2>

            <div className="space-y-4 text-lg text-gray-700">
              <p>
                Con la <strong className="text-[#EF9659]">Cuota BPA</strong> obtienes una <strong>suscripción mensual</strong> que te da acceso completo a:
              </p>

              <ul className="space-y-3 list-disc pl-5">
                <li>Visualización de todas tus clases</li>
                <li>Registro de asistencia en línea</li>
                <li>Flexibilidad para seleccionar tu cantidad de clases semanales</li>
                <li>Elección de horarios según tu disponibilidad</li>
              </ul>

              <p className="italic text-gray-600">
                Adaptamos nuestra oferta educativa a tus necesidades personales.
              </p>
            </div>
          </div>

          {/* Imagen - Derecha */}
          <div className="md:w-1/2 flex justify-center">
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 max-w-md">
              <img
                src={logo}
                alt="Logo BPA - Beneficios de la suscripción"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Recuadro 2 - Versión mejorada */}
      <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden mb-8 max-w-6xl mx-auto">
        <div className="flex-1 p-8 space-y-6 border-r border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Seleccione su paquete</h2>
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
                <div className="flex justify-between items-center">
                  <span>{option.label}</span>
                  <span className="text-sm opacity-75">
                    {option.price.toLocaleString('es-AR', {
                      style: 'currency',
                      currency: 'ARS'
                    })}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-[#EF9659] mb-2">Incluye:</h3>
            <p className="text-gray-600">{selectedOption?.description}</p>
          </div>
        </div>

        <div className="flex-1 p-8 bg-gray-50">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Horarios seleccionados</h3>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
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
              className={`w-full py-3 px-6 text-left bg-white border-2 rounded-lg transition-all ${selectedSchedules.length === activeOption
                ? 'border-green-500 hover:border-green-600'
                : 'border-red-500 hover:border-red-600'
                }`}
              disabled={selectedSchedules.length === activeOption}
            >
              {selectedSchedules.length > 0
                ? `${selectedSchedules.length} de ${activeOption} seleccionados`
                : "Seleccionar horarios"}
            </button>

            {showScheduleOptions && (
              <div className="mt-2 border rounded-lg shadow-lg max-h-96 overflow-y-auto">
                {[
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
                ].map((schedule, index) => (
                  <div
                    key={index}
                    className={`p-3 cursor-pointer transition-colors ${selectedSchedules.includes(schedule)
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
                      <span className={`mr-2 ${selectedSchedules.includes(schedule) ? 'text-blue-500' : 'text-transparent'}`}>
                        ✓
                      </span>
                      {schedule}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botón de pago deshabilitado con mensaje */}
          <div className="relative">
            <button
              onClick={handlePayment}
              className="w-full py-3 px-6 bg-gray-400 text-white font-semibold rounded-lg transition-colors cursor-not-allowed"
              disabled={true}
            >
              Próximamente...
            </button>
            <div className="absolute inset-0 bg-gray-800 bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">En desarrollo</span>
            </div>
          </div>
          
          <div className="mt-4 text-center text-gray-500 text-sm">
            El sistema de pagos estará disponible próximamente
          </div>
        </div>
      </div>
    </>
  );
}

export default TaskPage;