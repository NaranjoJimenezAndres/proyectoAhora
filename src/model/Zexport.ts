export interface FichaRendJug {
    _id: string,
    goles: number,
    asistencias: number
    pJ: number,
    minutosT: number,
    rating: number,
    caracteristicas: [
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

export interface Caracteristica {
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
}