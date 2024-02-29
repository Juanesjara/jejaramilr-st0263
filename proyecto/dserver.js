const express = require("express")
const server = express()
const {writeFile, readFile, readFileSync} = require('fs').promises; 
const { parse } = require("path");
server.use(express.json());
const path = "./directory.json";



server.get("/prueba",function (req, res) {
    res.status(200).send("informacion que vamos a enviar")
})

async function leerArchivo(path){
    return readFile(path, 'utf8').then((data) => data ? JSON.parse(data) : [])
    
}

function escribirArchivo(path, informacion){
    writeFile(path, JSON.stringify(informacion), (err, data) => {
        if(err){
            console.log('Error al escribir el archivo');
        }else{
            console.log("peer guardado correcto")
        }
    })
}


server.post("/login",  async (req, res)=>{
    let {user, password, ip} = req.body;
    let objectToSave = {user:user,ip:ip} 
    let data = await leerArchivo(path);
    console.log(data,"a")
    data.push(objectToSave)
    escribirArchivo(path,data);
    res.status(200).send("recibido")
});


server.post('/indexar', async (req, res) => {
    const {ip, archivos} = req.body
    let data;
    try {
        data = await leerArchivo(path);
        console.log(data, "envio del archivo")
    } catch (error) {
        console.error('Error al leer el archivo:', error);
    }
    let index = data.findIndex(obj => obj.ip==ip);
    if(index == -1){
        res.send("no encontre el peer")
        return;
    }
    let json = data[index]
    json.archivos = archivos;
    console.log(data, "array nuevo")
    escribirArchivo(path,data)
    res.send("archivos guardados");
})

server.get("/buscar", (req, res) => {
    
})


server.listen(4000, function () {
    console.log('ya estoy corriendo mi bro en el 4000')
});