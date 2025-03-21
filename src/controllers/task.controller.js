import Task from '../models/task.model.js'


export const getTasks = async (req, res) => {
   try {
    const tasks = await Task.find({
        user: req.user.id
    }).populate('user')
    res.json(tasks)
   } catch (error) {
         return res.status(500).json({ message: 'Algo salio mal...'})
   }
}

export const createTask = async (req, res) => {
    try{
        const { clase, asistencia, fecha } = req.body

    const createTask = new Task({
        clase,
        asistencia,
        fecha,
        user: req.user.id
    })
    const savedTask = await createTask.save()
    res.json(savedTask)
    } catch (erorr) {
        return res.status(500).json({ message: 'Algo salio mal...'})
    }
}

export const getTask = async (req, res) => {
    try{
        const findTask = await Task.findById(req.params.id).populate('user')
    if (!findTask) return res.status(404).json({ message: "Clase no encontrada"})
    res.json(findTask)
    } catch (error) {
        return res.status(404).json({ message: "Clase no encontrada"})
    }
}

export const deleteTask = async (req, res) => {
    try{
        const findTask = await Task.findByIdAndDelete(req.params.id)
    if (!findTask) return res.status(404).json({ message: "Clase no encontrada"})
    res.json(findTask)
    } catch (error) {
        return res.status(404).json({ message: 'clase no encontrada'})
    }
}

export const updateTask = async (req, res) => {
    try{
        const findTask = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if (!findTask) return res.status(404).json({ message: "Clase no encontrada"})
    res.json(findTask)
    } catch (error) {
        return res.status(404).json({ message: 'clase no encontrada'})
    }
}

