export interface Completo{
  _id: string,
  liga: string,
  nombreClub: string,
  pJ : number,
  golT: number,
  valorTM: number,
  europa: Boolean,
  plantilla: {
    _id: string,
    cod: number,
    nombre: string,
    edad: number,
    posicion: string,
    equipo: string,
    finContrato: Date,
    valorM: number,
    detalle: [
      {
        _id: string,
        goles: number,
        pJ: number,
        minutosT: number,
        rating: number
      }
    ]
  }
}

export interface Detalle {
  _id: string,
  goles: number,
  pJ : number,
  minutosT: number,
  rating: number
}