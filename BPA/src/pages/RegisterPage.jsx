import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'


function RegisterPage() {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const { signup, isAuthenticated, errors: registerErrors } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) navigate('/tasks')
    }, [isAuthenticated])

    const onSubmit = handleSubmit(async (data) => {
        signup(data)
    })

    return (
        <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
        <div className='bg-zinc-800 max-w-md p-10 rounded-md'>

            {
                registerErrors.map((error, i) => (
                    <div className='bg-red-500 p-2 text-white text-center my-2' key={i}>
                        {error}
                    </div>
                ))
            }

            <h1 className='text-2xl font-bold text-white'>Registrate</h1>
            <form onSubmit={onSubmit}>

                <input type="text" {
                    ...register('username', {
                        required: true,
                        maxLength: { value: 20, message: 'Name is too long' }
                    })
                }
                    className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                    placeholder='Nombre de ususario'
                />

                {errors.username &&
                    <p className='text-red-500'>El nombre de usuario es requerido</p>}

                <input type="email" {
                    ...register('email', {
                        required: true
                    })
                }
                    className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                    placeholder='Correo electronico'
                />

                {errors.email &&
                    <p className='text-red-500'>El email es requerido</p>}

                <input type="password" {
                    ...register('password', {
                        required: true
                    })
                }
                    className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                    placeholder='Contraseña'
                />

                {errors.password &&
                    <p className='text-red-500'>La contraseña es requerida</p>}

                <button type='submit' className='text-white bg-sky-500 px-4 py-2 rounded-md my-2'>
                    Registrate
                </button>


            </form>
            <p className='text-white flex gap-x-2 justify-between'>
                Ya tienes una cuenta?
                <Link to='/login' className='text-blue-500'>Ir a Iniciar sesión</Link>
            </p>
        </div>
        </div>

    )
}

export default RegisterPage