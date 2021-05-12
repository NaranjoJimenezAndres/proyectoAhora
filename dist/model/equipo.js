"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Definimos el Schema
const equipoSchema = new mongoose_1.Schema({
    _id: String,
    liga: String,
    nombreClub: String,
    pJ: Number,
    golT: Number,
    valorTM: Number,
    europa: Boolean
});
// La colección de la BD (Plural siempre)
exports.Equipos = mongoose_1.model('equipos', equipoSchema);
