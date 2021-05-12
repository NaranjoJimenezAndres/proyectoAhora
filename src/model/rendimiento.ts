import {Schema, model } from 'mongoose'

// Definimos el Schema
const rendimientoSchema = new Schema({
    _id: Number,
    goles: Number,
    asistencias: Number,
    pJ: Number,
    minutosT: Number,
    rating: Number,
})

export interface Rendimiento {
    _id: number,
    goles: number,
    asistencias: number
    pJ: number,
    minutosT: number,
    rating: number,
}


// La colección de la BD (Plural siempre)
export const Rendimientos = model('rendimientos', rendimientoSchema)