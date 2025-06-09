import { z } from 'zod'

export const createTaskSchema = z.object({
    clase: z.string({
        required_error: "Clase requerida"
    }),
    asistencia: z.string({
        required_error: "Asistencia requerida"
    }),
    fecha: z.date().optional()
})