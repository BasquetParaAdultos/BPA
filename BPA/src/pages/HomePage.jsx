import React from "react";


function HomePage() {
    return (
        <div>
            {/* Hero Section */}
            <div className="relative w-full h-[320px] md:h-[480px]" id="home">
                <div className="absolute inset-0 opacity-70">
                    <img
                        src="/images/home/BannerInicioBPA2.jpg"
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
                        <a
                            href="#contactUs"
                            className="inline-block mt-6 px-8 py-3 md:px-10 md:py-4
                bg-[#EF9659] text-white font-bold rounded-full 
                hover:bg-[#EF9659] transform hover:scale-105 
                transition-all duration-300 shadow-lg
                border-2
                [text-shadow:_1px_1px_0_#000]">
                            Conocer más
                        </a>
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
                                            Mesualmente se realiza un torneo para todos aquellos alumnos que quieran participar.
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
                                        <h3 className="text-lg font-semibold text-gray-700">Contacto</h3>
                                        <p className="mt-1 font-bold text-gray-600">
                                            <a href="tel:+123">Cel: +54 123456789</a>
                                        </p>
                                        <a className="flex m-1" href="tel:+919823331842">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-between h-10 w-30 rounded-md bg-[#EF9659] text-white p-2">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="w-6 h-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                                                        />
                                                    </svg>
                                                    Contactaté
                                                </div>
                                            </div>
                                        </a>
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
                                        <h3 className="text-lg font-semibold text-gray-700">Contacto</h3>
                                        <p className="mt-1 font-bold text-gray-600">
                                            <a href="tel:+123">Cel: +54 123456789</a>
                                        </p>
                                        <a className="flex m-1" href="tel:+919823331842">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-between h-10 w-30 rounded-md bg-[#EF9659] text-white p-2">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="w-6 h-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                                                        />
                                                    </svg>
                                                    Contactaté
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="px-6 py-4">
                                        <h3 className="text-lg font-medium text-gray-900">Dirección:</h3>
                                        <p className="mt-1 text-gray-600">Calle 131 e/ 39 y 40</p>
                                    </div>
                                    <div className="border-t border-gray-200 px-6 py-4">
                                        <h3 className="text-lg font-medium text-gray-900">Horarios:</h3>
                                        <p className="mt-1 text-gray-600">Lunes 21 a 22 p. m.</p>
                                        <p className="mt-1 text-gray-600">Miercoles 21 a 22 p. m. y 22 a 23 p. m.</p>
                                        <p className="mt-1 text-gray-600">Viernes 21 a 22 p. m.</p>
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
                                        <h3 className="text-lg font-semibold text-gray-700">Contacto</h3>
                                        <p className="mt-1 font-bold text-gray-600">
                                            <a href="tel:+123">Cel: +54 123456789</a>
                                        </p>
                                        <a className="flex m-1" href="tel:+919823331842">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-between h-10 w-30 rounded-md bg-[#EF9659] text-white p-2">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="w-6 h-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                                                        />
                                                    </svg>
                                                    Contactaté
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="px-6 py-4">
                                        <h3 className="text-lg font-medium text-gray-900">Dirección:</h3>
                                        <p className="mt-1 text-gray-600">Calle 131 e/ 39 y 40</p>
                                    </div>
                                    <div className="border-t border-gray-200 px-6 py-4">
                                        <h3 className="text-lg font-medium text-gray-900">Horarios:</h3>
                                        <p className="mt-1 text-gray-600">Jueves 21 a 22 p. m.</p>
                                        <p className="mt-1 text-gray-600">Miercoles 21 a 22 p. m. y 22 a 23 p. m.</p>
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
                </div>
            </section>
        </div>

    )
}

export default HomePage