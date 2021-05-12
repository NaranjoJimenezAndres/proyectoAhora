db.ab.insertMany([
    {"Nombre": "jose", "Apellido":"marti", "sueldo":1500 , "Provincia": "cadiz" },
    {"Nombre": "oscar", "Apellido":"frias", "sueldo":2500 , "Provincia": "sevilla" },
    {"Nombre": "jairo", "Apellido":"luis", "sueldo": 800 , "Provincia": "huelva" },
    {"Nombre": "ismael", "Apellido":"garcia", "sueldo": 500, "Provincia": "malaga" },
]);





db.ab.aggregate([{$match: {"Apellido":"marti"}}])


db.ab.aggregate([{_id:"nombre",
    media:
    {$avg:"sueldo"}}])