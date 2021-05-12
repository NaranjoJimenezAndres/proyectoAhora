db.ventas.aggregate([{$match: {"Fecha": { $gte: new ISODate("2019-01-01"), $lt: new ISODate("2020-01-01")}}},
{$group: {
    _id: {
        month: { $month: "$Fecha" },
        day: { $dayOfMonth: "$Fecha" },
        year: { $year: "$Fecha" }
    },
    totalSales: {$sum:{$multiply:["$Precio €", "Nº UD"]}}}}
])


db.ventas.aggregate([{$match: {"Fecha": { $gte: new Date("2019-01-01"), $lt: new Date("2020-01-01")}}}])




db.ventas.aggregate([{$group: {
    _id: {
        month: { $month: "$Fecha" },
        day: { $dayOfMonth: "$Fecha" },
        year: { $year: "$Fecha" }
    },
    totalSales: {$sum:{$multiply:["$Precio €", "$Nº UD"]}}}}
])

db.ventas.aggregate([{$match: {"Fecha": { $gte: new ISODate("2019-01-01"), $lt: new ISODate("2020-01-01")}}},
{$group: {
    _id: {
        month: { $month: "$Fecha" },
        day: { $dayOfMonth: "$Fecha" },
        year: { $year: "$Fecha" }
    },
    totalSales: {$sum:{$multiply:["$Precio €", "$Nº UD"]}}}},
])

    /*{ "_id" : { "month" : 8, "day" : 19, "year" : 2019 }, "totalSales" : 1550 }
{ "_id" : { "month" : 8, "day" : 8, "year" : 2019 }, "totalSales" : 1989 }
{ "_id" : { "month" : 8, "day" : 12, "year" : 2019 }, "totalSales" : 3260 }
{ "_id" : { "month" : 1, "day" : 25, "year" : 2019 }, "totalSales" : 1932 }
{ "_id" : { "month" : 5, "day" : 21, "year" : 2019 }, "totalSales" : 7658 }
{ "_id" : { "month" : 8, "day" : 23, "year" : 2019 }, "totalSales" : 3156 }
{ "_id" : { "month" : 5, "day" : 23, "year" : 2019 }, "totalSales" : 3330 }*/






db.ventas.aggregate([{$match: { 
    $or: [
        {Fecha : { $lte: new ISODate("2019-01-01")}},
        {Fecha : { $gte: new ISODate("2020-01-01")}}]}},

{$group: {
    _id: {year: { $year: "$Fecha" }},
    media: {$avg: {$multiply:["$Precio €", "$Nº UD"]}},
    
}}
])

/*
{ "_id" : { "year" : 2018 }, "media" : 2790 }
{ "_id" : { "year" : 2020 }, "media" : 1881.6666666666667 }
*/


db.ventas.aggregate([
    {$match: { 
        $or: [
            {Fecha : { $lte: new ISODate("2019-01-01")}},
            {Fecha : { $gte: new ISODate("2020-01-01")}}]}}])







db.ventas.aggregate([
    {
        $match:
            {"Premium": true}},
            {$group:{
                _id: {Cliente : "$Cliente"}
            }},
                
            {$project:{
            item:1,
            Cliente:1,
            Descuento:
            { $ifNull: [ "$Descuento", 15 ] }
          }
     },
    
  ]
)           

/*{ "_id" : { "Cliente" : "004" }, "Descuento" : 15 }
{ "_id" : { "Cliente" : "001" }, "Descuento" : 15 }
{ "_id" : { "Cliente" : "003" }, "Descuento" : 15 }*/


db.ventas.aggregate(
    [
        {$project:{
            Tipo:1,
            Cliente: 1,
            "Precio €": 1,
            "Nº UD": 1

        }},
      {
        $group:
          {
            _id: "$Cliente",
            maxPedido: { $max: { $multiply: [ "$Precio €", "$Nº UD" ] } },
            maxCantidad: { $max: "$Nº UD" }
          }
      },

    ]
 )

db.ventas.aggregate(
    [{
        $group: {
            _id: "$Cliente",
            total: {$sum: "$Nº UD"},
            count: {$sum: 1},
        }
    },
    {$project:{
        total:1,
        count: 1,
        Promedio_pedido: {$divide:["$total","$count"]}
    }}
])

/*{ "_id" : "004", "total" : 10, "count" : 4, "Promedio_pedido" : 2.5 }
{ "_id" : "001", "total" : 33, "count" : 8, "Promedio_pedido" : 4.125 }
{ "_id" : "002", "total" : 26, "count" : 5, "Promedio_pedido" : 5.2 }
{ "_id" : "003", "total" : 10, "count" : 4, "Promedio_pedido" : 2.5 }*/


db.ventas.aggregate(
    [{
        $match:{Fecha : { $gte: new Date("2020-01-01")}}},
        
        {
        $group: {
            _id: "$Transporte",
            total: {$sum: "$Nº UD"},
        }},
    {$project:
        {
        item:1,
        Fecha: {$year: new Date("2020-01-01")  },
        total:1,
        Penalizacion:{
            $cond: {if : {$lte: ["$total",10]}, 
                        then: true, else: false}
        }
    }}
])




db.ventas.aggregate(
    [ {
        $group: {
            _id: "$Tipo",
            Total:{$sum:{ $multiply: [ "$Precio €", "$Nº UD" ] }}
        }},
        

])
/*{ "_id" : "B", "Total" : 13974 }
{ "_id" : "D", "Total" : 12768 }
{ "_id" : "C", "Total" : 2092 }
{ "_id" : "A", "Total" : 19411 }*/


db.ventas.aggregate(
    [{
        $match:{"Tipo": "A"}
    },
    {
    $group: {
        _id: "$Fabricante",
        MejorProducto: {$max:"$Precio €"}
    }}
    
        ])
/*{ "_id" : "Zanussi", "MejorProducto" : 555 }
{ "_id" : "Samnsung", "MejorProducto" : 865 }
{ "_id" : "Bosch", "MejorProducto" : 912 }*/


db.ventas.aggregate(
    [
        {$match:{Fecha: { $gte: new Date("2020-01-01")}}},
    {
    $group: {
        _id: "$Fabricante",
        MasVendido: {$max:"$Nº UD"}
    }}, 
    

    
        ])
/*
        { "_id" : "Zanussi", "MasVendido" : 2 }
        { "_id" : "Samnsung", "MasVendido" : 9 }
        { "_id" : "Bosch", "MasVendido" : 2 }*/






db.ventas.aggregate(
            [
              {
                $group:{
                    _id: {  year: { $year: "$Fecha" }},
                    Ventas:{ $addToSet: "$_id" }}},
                
                {
                    $sort:{_id:-1}
                }])

 /*{ "_id" : { "month" : 12, "year" : 2018 }, "Ventas" : [ 20 ] }
  { "_id" : { "month" : 11, "year" : 2020 }, "Ventas" : [ 18 ] }
{ "_id" : { "month" : 9, "year" : 2020 }, "Ventas" : [ 16 ] }
{ "_id" : { "month" : 8, "year" : 2020 }, "Ventas" : [ 8, 1, 9, 12, 3 ] }
{ "_id" : { "month" : 8, "year" : 2019 }, "Ventas" : [ 17, 19, 2, 10 ] }
{ "_id" : { "month" : 8, "year" : 2018 }, "Ventas" : [ 5, 21, 15 ] }
{ "_id" : { "month" : 7, "year" : 2020 }, "Ventas" : [ 14 ] }
{ "_id" : { "month" : 5, "year" : 2019 }, "Ventas" : [ 7, 13, 4 ] }
{ "_id" : { "month" : 4, "year" : 2020 }, "Ventas" : [ 11 ] }
{ "_id" : { "month" : 1, "year" : 2019 }, "Ventas" : [ 6  ] }*/


db.ventas.aggregate(
    [
      {
        $group:{
            _id: {  year: { $year: "$Fecha" }},
            Ventas:{ $addToSet: "$_id" }}},
        
        {
            $sort:{_id:-1}
        }])