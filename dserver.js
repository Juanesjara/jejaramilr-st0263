const express = require("express")
const server = express()
const {writeFile, readFile, readFileSync} = require('fs').promises; 
server.use(express.json());
const path = "./directory.json";

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
    data.push(objectToSave)
    if(data)
    escribirArchivo(path,data);
    res.status(200).send("usuario logeado")
});


server.post('/indexar', async (req, res) => {
    const {ip, archivos} = req.body
    let data;
    try {
        data = await leerArchivo(path);
    } catch (error) {
        console.error('Error al leer el archivo:', error);
    }
    let index = data.findIndex(obj => obj.ip==ip);
    if(index == -1){
        console.log("no encontre")
        res.status(400).send("no encontre el peer")
        return;
    }
    let json = data[index]
    json.archivos = archivos;
    console.log(data, "array nuevo")
    escribirArchivo(path,data)
    console.log(data, "array")
    res.send("archivos guardados");
})

server.get("/buscar", async (req, res) => {
    let {archivo} = req.headers
    let data = await leerArchivo(path);
    let disponibles = []
    data.forEach(element => {
        let index= element.archivos ? element.archivos.findIndex(obj => obj==archivo): -1
        if(index != -1){
            disponibles.push(element)
        }
    });
    if(disponibles.length > 0){
        console.log(disponibles, "el archivo esta en estos peers")
        res.status(200).send(disponibles)
    }else{
        res.status(404).send("no encontre ningun archivo")
    }
})

server.post("/logout", async (req, res) => {
    let {ip} = req.body;
    let data = await leerArchivo(path);
    let index = data.findIndex(obj => obj.ip == ip);
    data.splice(index,1)
    escribirArchivo(path,data);
    res.status(200).send("sesion terminada")
})

server.listen(4000, function () {
    console.log('ya estoy corriendo mi bro en el 4000')
});