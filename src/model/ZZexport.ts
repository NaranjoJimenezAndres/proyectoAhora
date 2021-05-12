export interface EquipoTotal {
    _id: string,
    liga: string,
    nombreClub: string,
    pJ : number,
    golT: number,
    europa: Boolean,
    plantilla: [
      {
        _id: string,
        cod: number,
        nombre: string,
        edad: number,
        posicion: string,
        equipo: string,
        finContrato: Date,
        valorM: number,
        _v: number
      }
    ]
}


export interface Plantilla {
        _id: string,
        cod: number,
        nombre: string,
        edad: number,
        posicion: string,
        equipo: string,
        finContrato: Date,
        valorM: number,
        _v: number
}


export interface Sumatorio {
    _id: [
      {
        posicion: string
    }],
    sumatorio: number
}