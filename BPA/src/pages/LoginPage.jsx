import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'


function LoginPage() {

    const { register, handleSubmit, formState: { errors } } = useForm()

    const { signin, errors: singInErrors, isAuthenticated, user } = useAuth()
    const navigate = useNavigate()

    const onSubmit = handleSubmit((data) => {
        signin(data)
    })

    useEffect(() => {
        console.log("isAuthenticated:", isAuthenticated);
        console.log("User:", user);
        if (isAuthenticated) {
            // Verifica si `user` está definido antes de acceder a su propiedad `role`
            if (user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/tasks');
            }
        }
    }, [isAuthenticated, user]); // Añade `user` como dependencia


    return (
        <div className='flex h-[calc(100vh-100px)] items-center justify-center'>

            <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md'>
                {
                    singInErrors.map((error, i) => (
                        <div className='bg-red-500 p-2 text-white text-center my-2' key={i}>
                            {error}
                        </div>
                    ))
                }
                <h1 className='text-2xl font-bold text-white'>Inicia Sesión</h1>

                <form onSubmit={onSubmit}>


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
                        Iniciar sesión
                    </button>


                </form>
                <p className='text-white flex gap-x-2 justify-between'>
                    No tienes cuenta?
                    <Link to='/register' className='text-blue-500'>Registrate</Link>
                </p>
            </div>

        </div>

    )
}

export default LoginPage