import { Equipo, Equipos } from './model/equipo'
import {Jugador, Jugadores} from './model/jugador'
import {Rendimiento, Rendimientos} from './model/rendimiento'
import {FichaRendJug, Caracteristica} from './model/Zexport'
import {EquipoTotal, Plantilla, Sumatorio} from './model/ZZexport'
import {Completo, Detalle} from './model/ZZZexport'
import {EquipoFutbolista, Futbolista} from './model/Z4export'
import {EquipoJugRenB, DescripcionB} from './model/Z5exportB'


import { db } from './database/database'
import {Request, Response} from 'express'
import express from 'express'
const app = express()
const port = 3000


app.get('/', (req, res) => {
  res.send("<h1>Análisis y Scouting de ligas de fútbol profesionales</h1> <br><h3> Para consultar las características extraidas de los futbolistas procesadas completamente. <i>/caracteristicasmongo</i>.</h3> <br><h3> Para consultar las características de los futbolistas mediante algoritmos.<i>/caracteristicas</i></h3><br><h3>Para calcular una estimación media de los equipos por posición en las diferentes ligas (introduciendo las siglas del pais de la liga Ej. ENG o ESP).<i>/consulta/:liga</i></h3> <br><h3> Para realizar distintos análisis si los equipos juegan competición europea o no (introduciendo 'europa' o 'no'). <i>/equipos/:europa</i></h3><br><h3> Para calcular los dias restante de contrato de los futbolistas. <i>/dias</i> </h3><br><h3> Para saber el rendimiento anotador de los futbolistas procesado completamente por Mongo Atlas<i>/jugadoresGol</i></h3> <br><h3> Para saber el rendimiento anotador del futbolista deseado (introduciendo su nombre tal y como esta almacenado en la base de datos Ej.'Sergio Canales'. <i>/jugador/:nombre_jugador</i>");
});
app.listen(process.env.PORT || port);

/*Se quiere saber diversos el rendimiento de los futbolistas a partir de los datos recolectados en el campo*/

const fun1 = async (req: Request, res: Response) => {
          const valor = req.params.dep
    await db.conectarBD()
    .then( 
      async (mensaje) => {
        console.log(mensaje)
        const query = await Rendimientos.aggregate([
  {
      $match: {
          $and: [{ "rating": { $gte: 7.00 } },
          { "goles": { $gt: 0 } }]
      }
  },
  {
      $lookup: {
          "localField": "_id",
          "from": "jugadores",
          "foreignField": "cod",
          "as": "caracteristicas"
      }
  },
  {
      $group: {
          _id: {
              equipo: "$caracteristicas.equipo",
              nombre: "$caracteristicas.nombre"
          },
          goles: { $push: "$goles" },
          tiempo_Partido: { $sum: { $divide: ["$minutosT", "$pJ"] } },
          tasa_Gol: {
              $sum: { $divide: ["$minutosT", "$goles"] }
          }
      }
  },
  {
      $set: {
          promedioGolPartido: {
              $round: [{ $divide: ["$tasa_Gol", "$tiempo_Partido"] }, 2]
          }
      }
  },
  {
      $match: { "promedioGolPartido": { $lte: 5.00 } }
  },
  {
      $project: {
          equipo: "$_id.equipo",
          nombre: "$_id.nombre",
          goles: {$arrayElemAt:["$goles",0]},
          _id: 0,
          tiempo_Partido: 1,
          tasa_Gol: 1,
          promedioGolPartido: 1
      }
  },
  {
      $sort: { promedioGolPartido: 1 }
  }
])
res.json(query)
    })
    .catch(
      (mensaje) => {
        res.send(mensaje)
        console.log(mensaje)
    })
    db.desconectarBD()
  }


/*lo mismo pero usando Typescript*/

const fun2 = async (req: Request, res: Response) => {
    await db.conectarBD()
    .then( 
      async (mensaje) => {
        console.log(mensaje)
        let array: Array<FichaRendJug>
        const query: any = await Rendimientos.aggregate([
          {
                $lookup: {
                  localField: "_id",
                  from: "jugadores",
                  foreignField: "cod",
                  as: "caracteristicas"
              }
          }
          ])
          array = query
          let tiempo_Partido: number = 0    /*definicion de variables*/
          let tasa_GolxMinuto: number = 0
          let tasa_asistencia: number = 0
          let promedioGolxPartido: number = 0
          let elemen: FichaRendJug
          let elem: Caracteristica

          interface respuesta {
          id: string,
          nombreJugador: string,    /*definicion de resultados a mostrar*/
          equipo: string,
          posicion: string,
          tiempo_Partido: number,
          tasa_GolxMinuto: number,
          tasa_asistencia: number,
          promedioGolxPartido: number
        }
        let resultado: Array<respuesta> = []

        for (elemen of array){
          tiempo_Partido = 0
          tasa_GolxMinuto = 0     /*iteracion para el acceso a los datos*/
          tasa_asistencia = 0
          promedioGolxPartido = 0


        for (elem of elemen.caracteristicas) {
                console.log(elemen.caracteristicas);
                tiempo_Partido = elemen.minutosT / elemen.pJ
                tasa_GolxMinuto = elemen.minutosT / elemen.goles
                tasa_asistencia = elemen.minutosT / elemen.asistencias
                promedioGolxPartido=  tasa_GolxMinuto / tiempo_Partido
            
           console.log(`tiempo_Partido: ${tiempo_Partido}`)
           resultado.push({
              id: elemen._id,
              nombreJugador: elem.nombre,
              equipo: elem.equipo,
              posicion: elem.posicion,
              tiempo_Partido: tiempo_Partido,
              tasa_GolxMinuto: tasa_GolxMinuto,
              tasa_asistencia : tasa_asistencia,
              promedioGolxPartido: promedioGolxPartido
          })}          
      }
      res.json(resultado)
      })
    .catch(
      (mensaje) => {
        res.send(mensaje)
        console.log(mensaje)
    })
    db.desconectarBD()
  }





/*Se quiere saber algun metodo comparativo del valor de los equipos de las distintas ligas*/


const fun3 = async (req: Request, res: Response) => {
          const valor = req.params.liga     /*parametro externo introducido por el usuario*/
    await db.conectarBD()
    .then( 
      async (mensaje) => {
        console.log(mensaje)
        let arraySumatorio: Array<Sumatorio>
        const query : any = await Equipos.aggregate([
          {
            $match: {
              "liga": valor
            }
          },
          {
              $lookup: {
                  from: "jugadores",
                  localField: "nombreClub",
                  foreignField: "equipo",
                  as: "plantilla"
              }
          },
          {

        $unwind: "$plantilla"

    },
      {
        $group: {
            _id: {
                posicion: "$plantilla.posicion"
            
            } ,
            sumatorio: { $sum: "$plantilla.valorM" },}},
        ])
        arraySumatorio = query
        console.log(arraySumatorio)
        let mediaValorEquipoxPoscicion : number = 0
        let valorMedioTotal : number = 0 
        let elem: Sumatorio

        for (elem of arraySumatorio){
          console.log(elem.sumatorio)
          mediaValorEquipoxPoscicion += elem.sumatorio / arraySumatorio.length
        }
       
        res.json(
        {"mediaValorEquipoxPoscicion": mediaValorEquipoxPoscicion})
            })
    .catch(
      (mensaje) => {
        res.send(mensaje)
        console.log(mensaje)
    })
    db.desconectarBD()
}





/*Se quiere saber el porcentaje de valor de equipo de los futbolistas en caso de que juegen competicion europea, o los equipos que no juegan dichas competiciones*/

const fun4 = async (req: Request, res: Response) => {
    await db.conectarBD()
    .then( 
      async (mensaje) => {
        console.log(mensaje)
        const valor = req.params.europa
        if (valor == "europa"){     
          console.log(mensaje)
          let array : Array<EquipoFutbolista>
        const query : any =  await Equipos.aggregate([
          {
            $match:{"europa": true}
          },
              {
            $lookup: {
            localField: "nombreClub",
            from: "jugadores",
            foreignField: "equipo",
            as: "plantilla"
              }
         }
        ])
        array = query
        let porcentajeValorxEquipo: number = 0
        let elemen: EquipoFutbolista
        let elem : Futbolista

        interface respuesta {
          liga: string,
          equipo: string,
          nombreJugador: string
          valorTotalM: number,
          valorJugadorM: number,
          porcentajeValorxEquipo: number
        }
        let resultado: Array<respuesta> = []

        for (elemen of array){
          porcentajeValorxEquipo = 0
      
        for (elem of elemen.plantilla){
            console.log(elemen.plantilla);
            porcentajeValorxEquipo = elem.valorM / elemen.valorTM * 100
        
        console.log()
        resultado.push({
          liga: elemen.liga,
          equipo: elemen.nombreClub,
          nombreJugador: elem.nombre,
          valorTotalM: elemen.valorTM,
          valorJugadorM: elem.valorM,
          porcentajeValorxEquipo : porcentajeValorxEquipo
              })}
        }
        res.json(resultado)     
        
        
        } else if (valor == "no") {
          const query = await Equipos.find(
            {
            europa:{"$exists": false}
          }
            )
          res.json(query)
        }

    })
    .catch(
      (mensaje) => {
        res.send(mensaje)
        console.log(mensaje)
    })
    db.desconectarBD()
}


/*se quiere saber los dias que quedan de contrato de los jugadores de la base de datos por si son susceptibles de ser transferibles*/


const fun5 = async (req: Request, res: Response) => {
    await db.conectarBD()
    .then( 
        async (mensaje) => {
          let date = new Date()    /*Obtencion del dia actual*/
          let arrayJugadores: Array<Jugador>
          const query: any = await Jugadores.find({},{
          _id: 0,
          cod: 1,
          nombre: 1,
          edad:1,
          posicion: 1,
          equipo: 1,
          finContrato: 1,
          valorM: 1
          })

          console.log(query)
          arrayJugadores = query 
          let diasResta: number = 0
          let diasRestantes: number = 0
          let jugador: Jugador

          interface respuesta {
          cod: string,
          nombreJugador: string,
          edad: number, 
          posicion: string,
          equipo: string,
          valorM: number,
          diasRestantes: number      
        }

        let resultado: Array<respuesta> = []

          for (jugador of arrayJugadores){
            diasResta = jugador.finContrato.getTime() - date.getTime() /*restar las fechas*/
            diasRestantes = Math.round(diasResta /(1000 * 3600 * 24))

          

          resultado.push({
              cod: jugador.cod,
              nombreJugador: jugador.nombre,
              equipo: jugador.equipo,
              posicion: jugador.posicion,
              edad: jugador.edad,
              valorM: jugador.valorM,
              diasRestantes : diasRestantes
               })          
          }
      res.json(resultado)
      })
    .catch(
      (mensaje) => {
        res.send(mensaje)
        console.log(mensaje)
    })
    db.desconectarBD()
  }

/*Saber el rendimiento goleador de los futbolistas*/
  const fun6 = async (req: Request, res: Response) => {
    await db.conectarBD()
    .then( 
      async (mensaje) => {
        console.log(mensaje)
        const query = await Jugadores.aggregate([
  {
      $lookup: {
          "localField": "equipo",
          "from": "equipos",
          "foreignField": "nombreClub",
          "as": "plantilla"
      }
  },
  {

      $unwind: "$plantilla"

  },
  {
      $lookup: {
          "localField": "cod",
          "from": "rendimientos",
          "foreignField": "_id",
          "as": "descripcion"
      }
  },
  {

      $unwind: "$descripcion"

  },
  {
      $match: {
          $and: [{ "posicion": { $eq: "DEL" } },
          { "edad": { $lte: 25 } },
          { "plantilla.liga": { $eq: "ESP" } }
          ]
      }
  },
  {
      $project: {
          jugador: "$nombre",
          edad: "$edad",
          _id: 0,
          club: "$plantilla.nombreClub",
          goles: "$descripcion.goles",
          golesTotal: "$plantilla.golT"
      }
  },
  {
      $set: {
          porcentaje: {
              $round: [
                  {
                      $multiply: [
                          {
                              $divide: ["$goles", "$golesTotal"]
                          }, 100]
                  },
                  2]
          }
      }
  }
])
        res.json(query)
    })
    .catch(
      (mensaje) => {
        res.send(mensaje)
        console.log(mensaje)
    })
    db.desconectarBD()
  }

/*saber el rendimiento anotador de un futbolista deseado*/

const fun7 = async (req: Request, res: Response) => {
          const valor = req.params.nombre_jugador
    await db.conectarBD()
    .then( 
      async (mensaje) => {
        console.log(mensaje)
        let array: Array<EquipoJugRenB>
        const query: any = await Jugadores.aggregate([
          {
            $match:{"nombre": valor}

          },
  {
      $lookup: {
          "localField": "equipo",
          "from": "equipos",
          "foreignField": "nombreClub",
          "as": "plantilla"
      }
  },
  {

      $unwind: "$plantilla"

  },
  {
      $lookup: {
          "localField": "cod",
          "from": "rendimientos",
          "foreignField": "_id",
          "as": "descripcion"
      }
  }
  ])
  array = query
  let porcentajeGolesTotales: number = 0
  let elemen: EquipoJugRenB
  let el: DescripcionB

  interface respuesta {
    jugador: string,
    edad: number,
    club: string,
    goles: number,
    golesTotales: number,
    porcentajeGolesTotales: number
  }

  let resultado: Array<respuesta> = []

  for (elemen of array){
    porcentajeGolesTotales = 0

    for(el of elemen.descripcion){
      porcentajeGolesTotales = Math.round(el.goles / elemen.plantilla.golT *100)
    
    resultado.push({
            jugador:elemen.nombre,
            edad: elemen.edad,
            club: elemen.plantilla.nombreClub,
            goles: el.goles,
            golesTotales:elemen.plantilla.golT,
            porcentajeGolesTotales: porcentajeGolesTotales
          })}
  }
  res.json(resultado)
    })
    .catch(
      (mensaje) => {
        res.send(mensaje)
        console.log(mensaje)
    })
    db.desconectarBD()
  }











app.get('/caracteristicasmongo', fun1)
app.get('/caracteristicas', fun2)
app.get('/consulta/:liga', fun3)
app.get('/equipos/:europa', fun4)
app.get('/dias', fun5)
app.get('/jugadoresGol', fun6)
app.get ('/jugador/:nombre_jugador', fun7)





