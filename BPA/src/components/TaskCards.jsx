import { useTasks } from "../context/TaskContext";
import { Link } from 'react-router-dom'

function TaskCards({ task }) {

    const {deleteTask} = useTasks()

    return (

        <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md text-white">
            <header className="flex justify-between">
                <h1 className="text-2xl font-bold  text-white">{task.clase}</h1>
                <div className="flex gap-2 items-center">
                    <button
                     onClick={() => {deleteTask(task._id)}}
                     className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                     >Borrar</button>
                    <Link to={`/tasks/${task._id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">Editar</Link>
                </div>
            </header>
            <p className="text-slate-300">{task.asistencia}</p>
            <p>{new Date(task.date).toLocaleDateString()}</p>
        </div>

    )
}

export default TaskCards