export interface EquipoFutbolista {
  _id: string,
  liga: string,
  nombreClub: string,
  pJ : number,
  golT: number,
  valorTM: number,
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
    }
  ]
}


export interface Futbolista {
     _id: string,
    cod: number,
    nombre: string,
    edad: number,
    posicion: string,
    equipo: string,
    finContrato: Date,
    valorM: number
}