import {Schema, model } from 'mongoose'

// Definimos el Schema
const jugadorSchema = new Schema({
    cod: String,
    nombre: String,
    edad: Number,
    posicion: String,
    equipo: String,
    finContrato: Date,
    valorM: Number
})

export interface Jugador {
    cod: string,
    nombre: string,
    edad: number,
    posicion: string,
    equipo: string,
    finContrato: Date,
    valorM: number
}


// La colección de la BD (Plural siempre)
export const Jugadores = model('jugadores', jugadorSchema)