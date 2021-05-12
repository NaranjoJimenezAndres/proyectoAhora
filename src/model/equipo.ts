import {Schema, model } from 'mongoose'

// Definimos el Schema
const equipoSchema = new Schema({
    _id: String,
    liga: String,
    nombreClub: String,
    pJ: Number,
    golT: Number,
    valorTM: Number,
    europa: Boolean
})

export interface Equipo {
    _id: string,
    liga: string,
    nombreClub: string,
    pJ: number,
    golT: number,
    valorTM: number,
    europa: Boolean

}

// La colección de la BD (Plural siempre)
export const Equipos = model('equipos', equipoSchema)