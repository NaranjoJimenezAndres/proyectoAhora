export interface EquipoJugRenB {
    _id: string,
    cod: number,
    nombre: string,
    edad: number,
    posicion: string,
    finContrato: Date,
    valorM: number,
    plantilla:{
        _id: string,
        liga: string,
        nombreClub: string,
        pJ: number,
        golT: number,
        valorTM: number,
        europa: true}
    descripcion: [{
                  _id: string,
                  goles: number,
                  pJ: number,
                  minutosT:number,
                  rating: number
               }]
          }





export interface DescripcionB {
   _id: string,
      goles: number,
      pJ: number,
      minutosT:number,
      rating: number
}