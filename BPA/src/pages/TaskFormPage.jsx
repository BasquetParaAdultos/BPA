import { useForm } from 'react-hook-form'
import { useTasks } from "../context/TaskContext";
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react';


function TaskFormPage() {
    const { register, handleSubmit, setValue } = useForm()
    const { createTask, getTask, updateTask } = useTasks()
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        async function loadTask() {
            if (params.id) {
                const task = await getTask(params.id)
                console.log(task)
                setValue('clase', task.clase)
                setValue('asistencia', task.asistencia)
            }
        }
        loadTask()
    }, [])

    const onSubmit = handleSubmit((data) => {
       if (params.id) {
       updateTask(params.id, data)
       } else {
        createTask(data)
       }
       navigate('/tasks')
    })

    return (
        <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
            <form onSubmit={onSubmit} className="flex flex-col">
                <label htmlFor="clase">Clase</label>
                <input
                    type="text"
                    placeholder="Clase"
                    {...register('clase')}
                    className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                    autoFocus
                />

                <label htmlFor="asistencia">Asistencia</label>
                <input
                    type="text"
                    placeholder="Asistencia"
                    {...register('asistencia')}
                    className="w-full- bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                />
                

                <button className='text-white bg-indigo-500 px-3 py-2 rounded-md my-2'>Guardar</button>
            </form>
        </div>
    )
}

export default TaskFormPage