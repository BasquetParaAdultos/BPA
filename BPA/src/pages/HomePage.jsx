import React from "react";
import banner from "/images/home/BannerInicioBPA2.jpg";
import { useNavigate } from "react-router-dom";


function HomePage() {
    const navigate = useNavigate();

    const scrollToContact = () => {
    navigate("#contactUs");  // Actualiza la URL
    setTimeout(() => {       // Pequeño delay para asegurar el renderizado
      const element = document.getElementById("contactUs");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 10);
  };

    return (
        <div>
            {/* Hero Section */}
            <div className="relative w-full h-[320px] md:h-[480px]" id="home">
                <div className="absolute inset-0 opacity-70">
                    <img
                        src={banner}
                        alt="Background Image"
                        className="object-cover object-center w-full h-full"
                    />
                </div>

                <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="text-center max-w-4xl mx-auto space-y-4 md:space-y-6">
                        {/* Título con efecto de letra blanca y borde negro */}
                        <h1 className="text-3xl md:text-6xl font-bold 
                                     text-white 
                                       [text-shadow:_3px_3px_0_#000,_-1px_-1px_0_#000] 
                                       drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]
                                       transition-all duration-300">
                            Básquet para adultos
                        </h1>

                        {/* Subtítulo con efecto similar pero más sutil */}
                        <p className="text-lg md:text-2xl font-semibold 
                                    text-white 
                                      [text-shadow:_2px_2px_0_#000,_-1px_-1px_0_#000]
                                      drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]
                                      max-w-2xl mx-auto">
                            ¿Tenés más de 18 años y querés jugar al básquet?
                        </p>
                        <p className="text-lg md:text-2xl font-semibold 
                                    text-white 
                                      [text-shadow:_2px_2px_0_#000,_-1px_-1px_0_#000]
                                      drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]
                                      max-w-2xl mx-auto"
                        > ¡Te esperamos!</p>

                        {/* Botón mejorado */}
                        <button
                            onClick={scrollToContact}
                            className="inline-block mt-6 px-8 py-3 md:px-10 md:py-4
                bg-[#EF9659] text-white font-bold rounded-full 
                hover:bg-[#EF9659] transform hover:scale-105 
                transition-all duration-300 shadow-lg
                border-2
                [text-shadow:_1px_1px_0_#000]">
                            Conocer más
                        </button>   
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <section className="py-16" id="services">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">¿Qué ofrecemos?</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 justify-items-center gap-8 max-w-6xl mx-auto">
                        {/* Primera fila */}
                        <div className="w-full max-w-sm">
                            <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
                                <div className="relative overflow-hidden">
                                    <img
                                        src="/images/home/servicios1.jpg"
                                        alt="Entrenamiento técnico"
                                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-6 text-center">
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">Técnica individual</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Todas nuestras clases tendrán un profesor a cargo que te ayudará a mejorar tu técnica individual.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full max-w-sm">
                            <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
                                <div className="relative overflow-hidden">
                                    <img
                                        src="/images/home/servicios2.jpg"
                                        alt="Cancha profesional"
                                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-6 text-center">
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">Espacio de juego</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Todas nuestras clases contaran con un espacio de juego para que puedas practicar y mejorar tus habilidades.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full max-w-sm">
                            <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
                                <div className="relative overflow-hidden">
                                    <img
                                        src="/images/home/servicios3.jpg"
                                        alt="Horarios flexibles"
                                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-6 text-center">
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">Flexibilidad horaria</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Contamos con una gran variedad de horarios y ubicaciones para que puedas encontrar la que mas se adecue a tus necesidades.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Segunda fila centrada */}
                        <div className="md:col-span-3 flex flex-col md:flex-row justify-center gap-8 w-full">
                            <div className="w-full max-w-sm">
                                <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
                                    <div className="relative overflow-hidden">
                                        <img
                                            src="/images/home/servicios4.jpg"
                                            alt="Clases inclusivas"
                                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-6 text-center">
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">Clases Mixtas</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            Todas las clases son mixtas a exepción de 1 horario semanal femenino.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full max-w-sm">
                                <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
                                    <div className="relative overflow-hidden">
                                        <img
                                            src="/images/home/servicios5.jpg"
                                            alt="Torneo BPA"
                                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-6 text-center">
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">Torneo BPA</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            Mensualmente se realiza un torneo para todos aquellos alumnos que quieran participar.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Torneo */}
            <section className="bg-gray-100 py-16 md:py-24" id="aboutus">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Text Content */}
                        <div className="order-2 md:order-1">
                            <div className="max-w-xl mx-auto">
                                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center md:text-left mb-4">
                                    🔥 Torneo BPA
                                </h2>
                                <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center md:text-left mb-8">
                                    La competencia mensual que todos esperan
                                </h3>

                                <div className="space-y-6">
                                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                                        ¿Te gusta el básquet y querés poner a prueba tus habilidades en un ambiente divertido y competitivo? ¡El Torneo BPA es tu oportunidad!
                                    </p>

                                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                                        Formamos equipos equilibrados que compiten en partidos llenos de energía y compañerismo. No importa si llevas años jugando o si estás empezando: aquí todos comparten la misma pasión por el juego y las ganas de superarse.
                                    </p>


                                </div>
                            </div>
                        </div>

                        {/* Image Torneo */}
                        <div className="order-1 md:order-2">
                            <div className="relative rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                                <img
                                    src="/images/home/toneoBPA.jpg"
                                    alt="Equipo celebrando durante el Torneo BPA"
                                    className="w-full h-64 md:h-96 object-cover object-center"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Instagram */}
            <section className="bg-gray-100 py-16 md:py-24" id="instagram">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Image Instagram */}
                        <div className="order-1">
                            <div className="relative rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                                <img
                                    src="/images/home/ig.jpg"
                                    alt="Comunidad BPA en Instagram"
                                    className="w-full h-64 md:h-96 object-cover object-center"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent"></div>
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="order-2">
                            <div className="max-w-xl mx-auto">
                                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center md:text-left mb-4">
                                    @basquet.para.adultos
                                </h2>
                                <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center md:text-left mb-8">
                                    ¡Seguinos y sumate a la comunidad!
                                </h3>

                                <div className="space-y-6">
                                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                                        Descubrí nuestro contenidos exclusivos y mantenete al día con todas las novedades de la escuela. En nuestro Instagram compartimos:
                                    </p>

                                    <ul className="text-lg md:text-xl text-gray-600 leading-relaxed list-disc pl-6 space-y-4">
                                        <li>📌 Noticias y actualizaciones</li>
                                        <li>🎉 Eventos especiales y sorteos</li>
                                    </ul>

                                    <div className="mt-8 text-center md:text-left">
                                        <a
                                            href="https://www.instagram.com/basquet.para.adultos/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center bg-[#EF9659] hover:bg-[#D4874F] text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-300 shadow-md hover:shadow-lg"
                                        >
                                            <span>Síguenos en Instagram</span>
                                            <svg
                                                className="w-5 h-5 ml-2"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="text-gray-700 body-font" id="gallery">
                <div className="flex justify-center text-3xl font-bold text-gray-800 text-center py-10">
                    Galeria de Fotos
                </div>
                <div className="grid grid-cols-1 place-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {/* Galeria */}
                    {/* Foto 1 */}
                    <div className="group relative">
                        <img
                            src="/images/home/galeria1.jpg"
                            alt="Image 1"
                            className="aspect-[2/3] h-80 object-cover rounded-lg transition-transform transform scale-100 group-hover:scale-105"
                        />
                    </div>
                    {/* Foto 2 */}
                    <div className="group relative">
                        <img
                            src="/images/home/galeria2.jpg"
                            alt="Image 1"
                            className="aspect-[2/3] h-80 object-cover rounded-lg transition-transform transform scale-100 group-hover:scale-105"
                        />
                    </div>
                    {/* Foto 3 */}
                    <div className="group relative">
                        <img
                            src="/images/home/galeria3.jpg"
                            alt="Image 1"
                            className="aspect-[2/3] h-80 object-cover rounded-lg transition-transform transform scale-100 group-hover:scale-105"
                        />
                    </div>
                    {/* Foto 4 */}
                    <div className="group relative">
                        <img
                            src="/images/home/galeria4.jpg"
                            alt="Image 1"
                            className="aspect-[2/3] h-80 object-cover rounded-lg transition-transform transform scale-100 group-hover:scale-105"
                        />
                    </div>
                    {/* Foto 5 */}
                    <div className="group relative">
                        <img
                            src="/images/home/galeria5.jpg"
                            alt="Image 1"
                            className="aspect-[2/3] h-80 object-cover rounded-lg transition-transform transform scale-100 group-hover:scale-105"
                        />
                    </div>
                    {/* Foto 6 */}
                    <div className="group relative">
                        <img
                            src="/images/home/galeria6.jpg"
                            alt="Image 1"
                            className="aspect-[2/3] h-80 object-cover rounded-lg transition-transform transform scale-100 group-hover:scale-105"
                        />
                    </div>
                    {/* Foto 7 */}
                    <div className="group relative">
                        <img
                            src="/images/home/galeria7.jpg"
                            alt="Image 1"
                            className="aspect-[2/3] h-80 object-cover rounded-lg transition-transform transform scale-100 group-hover:scale-105"
                        />
                    </div>
                    {/* Foto 8 */}
                    <div className="group relative">
                        <img
                            src="/images/home/galeria8.jpg"
                            alt="Image 1"
                            className="aspect-[2/3] h-80 object-cover rounded-lg transition-transform transform scale-100 group-hover:scale-105"
                        />
                    </div>
                </div>
            </section>

            {/* Ubicaciones */}
            <section className="bg-gray-100">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:py-20 lg:px-8">
                    <div className="max-w-2xl lg:max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900" id="contactUs">Nuestras Ubicaciones</h2>
                        <p className="mt-3 text-lg text-gray-500">Conoce las canchas donde se desarrollan nuestras clases:</p>
                    </div>
                    {/* MV */}
                    <div className="mt-8 lg:mt-20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <div className="max-w-full mx-auto rounded-lg overflow-hidden">
                                    <div className="border-t border-gray-200 px-6 py-4">
                                        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Meridiano V</h1>
                                        
                                        
                                    </div>
                                    <div className="px-6 py-4">
                                        <h3 className="text-lg font-medium text-gray-900">Dirección:</h3>
                                        <p className="mt-1 text-gray-600">Calle 67 e/ 16 y 17</p>
                                    </div>
                                    <div className="border-t border-gray-200 px-6 py-4">
                                        <h3 className="text-lg font-medium text-gray-900">Horarios:</h3>
                                        <p className="mt-1 text-gray-600">Lunes 7 a 8 a. m. - Miercoles 7 a 8 a. m. - Viernes 7 a 8 a. m.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg overflow-hidden order-none sm:order-first">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d408.8541210327781!2d-57.94310970978078!3d-34.935725822836076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a2e899c4c6ce7d%3A0x7caea870cf698114!2sC.%2067%201080%2C%20B1904AXP%20La%20Plata%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1742912752260!5m2!1ses!2sar"
                                    className="w-full"
                                    width="600"
                                    height="450"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                    {/* El Bosque */}
                    <div className="mt-8 lg:mt-20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <div className="max-w-full mx-auto rounded-lg overflow-hidden">
                                    <div className="border-t border-gray-200 px-6 py-4">
                                        <h1 className="text-xl md:text-2xl font-bold text-gray-900">El Bosque</h1>
                                    
                                        
                                    </div>
                                    <div className="px-6 py-4">
                                        <h3 className="text-lg font-medium text-gray-900">Dirección:</h3>
                                        <p className="mt-1 text-gray-600">Calle 131 e/ 39 y 40</p>
                                    </div>
                                    <div className="border-t border-gray-200 px-6 py-4">
                                        <h3 className="text-lg font-medium text-gray-900">Horarios:</h3>
                                        <p className="mt-1 text-gray-600">Lunes 20 a 21 p. m. y 21 a 22hs</p>
                                        <p className="mt-1 text-gray-600">Martes 21 a 22 p. m. y 22 a 23 p. m.</p>
                                        <p className="mt-1 text-gray-600">Viernes 21 a 22 p. m.(Clase Avanzada)</p>
                                        <p className="mt-1 text-gray-600">Sabado 9hs a 10:30hs y 10:30hs a 12hs</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg overflow-hidden order-none sm:order-first">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1415.6228057285957!2d-57.984357714276335!3d-34.92934807000448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a2e7e7fe15140d%3A0x5aee9379ab742481!2sEl%20Bosque%20Futbol%205!5e0!3m2!1ses!2sar!4v1742919775733!5m2!1ses!2sar"
                                    className="w-full"
                                    width="600"
                                    height="450"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                    {/* Estación Norte */}
                    <div className="mt-8 lg:mt-20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <div className="max-w-full mx-auto rounded-lg overflow-hidden">
                                    <div className="border-t border-gray-200 px-6 py-4">
                                        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Estación Norte</h1>
                                       
                                    </div>
                                    <div className="px-6 py-4">
                                        <h3 className="text-lg font-medium text-gray-900">Dirección:</h3>
                                        <p className="mt-1 text-gray-600">Calle 510 e/ 6 y 7</p>
                                    </div>
                                    <div className="border-t border-gray-200 px-6 py-4">  
                                        <h3 className="text-lg font-medium text-gray-900">Horarios:</h3>
                                        <p className="mt-1 text-gray-600">Jueves 19 a 20 p. m.(Femenino) y 20hs a 21hs(Mixto)</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg overflow-hidden order-none sm:order-first">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3273.014185384369!2d-57.99310080000001!3d-34.8809901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a2e720874be85d%3A0x50881d5b81a5305a!2sEstaci%C3%B3n%20Norte%20Padel!5e0!3m2!1ses-419!2sar!4v1748279836876!5m2!1ses-419!2sar"
                                    className="w-full"
                                    width="600"
                                    height="450"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    )
}

export default HomePage