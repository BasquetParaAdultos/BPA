import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { signin, errors: singInErrors, isAuthenticated, user } = useAuth()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false) // Nuevo estado para mostrar contraseña

    const onSubmit = handleSubmit((data) => {
        signin(data)
    })

    useEffect(() => {
        if (isAuthenticated) {
            user?.role === 'admin' ? navigate('/admin') : navigate('/tasks')
        }
    }, [isAuthenticated, user, navigate])

    return (
        <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
            <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md'>
                {singInErrors.map((error, i) => (
                    <div className='bg-red-500 p-2 text-white text-center my-2' key={i}>
                        {error}
                    </div>
                ))}

                <h1 className='text-2xl font-bold text-white'>Inicia Sesión</h1>

                <form onSubmit={onSubmit}>
                    <input
                        type="email"
                        {...register('email', { required: true })}
                        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                        placeholder='Correo electrónico'
                    />
                    {errors.email && <p className='text-red-500'>El email es requerido</p>}

                    {/* Contenedor relativo para el input de contraseña */}
                    {/* ... resto del código se mantiene igual ... */}

                    <div className="relative my-2">
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register('password', { required: true })}
                            className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md pr-10'
                            placeholder='Contraseña'
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 px-3 flex items-center"
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            {showPassword ? (
                                // Ícono de ojo abierto (contraseña oculta)
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            ) : (
                                // Ícono de ojo tachado (contraseña visible)
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* ... resto del código se mantiene igual ... */}
                    {errors.password && <p className='text-red-500'>La contraseña es requerida</p>}

                    <button
                        type='submit'
                        className='text-white bg-sky-500 px-4 py-2 rounded-md my-2 w-full hover:bg-sky-600 transition-colors'
                    >
                        Iniciar sesión
                    </button>
                </form>

                <p className='text-white flex gap-x-2 justify-between mt-4'>
                    No tienes cuenta?
                    <Link to='/register' className='text-blue-500 hover:text-blue-400 transition-colors'>
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage