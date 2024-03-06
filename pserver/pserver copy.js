const dotenv = require('dotenv');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
dotenv.config();
const axios = require("axios");
const express = require("express");
const server = express()    
server.use(express.json());

let files = ["archivo prueba"]




const PROTO_PATH = process.env.PROTO_PATH;
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
const serviceProto = grpc.loadPackageDefinition(packageDefinition).file_service




const HOST = 'localhost:50053'
const grpcserver = new grpc.Server();
 
/*class FileService{
    AddFile(call, callback){
        console.log("Request is received: " + call.request);
        callback(null);
    }

    GetFileByName(call, callback){
        console.log("Request is received: " + call.request)
        callback(null,{nombre: 1,link:2})
    }
}*/

function AddFile(file){
    for (let i = 0; i < file.length; i++) {
        files.includes(file[i])? console.log("ya esta"):files.push(file[i])
    }
}

//server grpc
function main(){
  

        function AddFile(call, callback){
            console.log("Request is received: " + call.request);
            for (let i = 0; i < file.length; i++) {
                files.includes(file[i])? console.log("ya esta"):files.push(file[i])
            }
            
        }
        function GetFileByName(call, callback){
            const nombre = call.request.name
            console.log(call.request.name, " nombre")
            console.log("Request is received: " + call.request.name)
            let index = files.indexOf(nombre);
            let resultado = index != -1 ? files[index]: "No existe el archivo";
            console.log(resultado, index)
            callback(null, {nombre: resultado}) 
        }
    
    grpcserver.addService(serviceProto.FileService.service, {AddFile, GetFileByName});
    grpcserver.bindAsync(HOST, grpc.ServerCredentials.createInsecure(),(err, port) => {
        if (err != null) {
            return console.error(err);
        }
        console.log(`gRPC listening on ${port}`)
    })
}
main()



//cliente 


const serviceProto2 = grpc.loadPackageDefinition(packageDefinition).file_service.FileService

server.post("/descargar", (req,res)=>{
    let {archivo, link} = req.body;
    const client = new serviceProto2(link, grpc.credentials.createInsecure())
    console.log("cree la conexion")
    client.GetFileByName({name:archivo},(err,data)=>{
            if(err){
                console.log("error:  " + err);
                res.status(400).send("no se encontro el archivo")
            }else{
                console.log("Respuesta recibida", data)
                res.status(200).send({archivo:data  ,mensaje:"Este archivo fue descargado con grpc"});
            }
            client.close()  
    })
})

server.post("/indexar", function(req,res){
    const {ip, archivos} = req.body
    AddFile(archivos) // deberia verificar esta ip antes de 
    let body = {
        ip : ip,
        archivos: files
    }
    axios.post("http://localhost:4000/indexar", body)
    .then(response => {
        res.send(response.data)
    })
    .catch((error)=> res.status(404).send(error.response.data))
})

server.post("/login", function(req,res){
    const {username, password, ip}= req.body
    const body = {
        user    : username,
        password: password,
        ip: ip
    }
    axios.post("http://localhost:4000/login", body)
    .then(response =>{
        res.status(200).send(response.data)
    })
    .catch(err =>{
        res.send(err)
        console.log("error: " + err)
    })
    
})  


server.get('/buscarArchivo/:archivo', function(req, res){
    let archivo = req.params.archivo 
    const headers = {
        archivo: archivo
      };
    axios.get('http://localhost:4000/buscar', { headers: headers })
    .then(response =>{
        let disponibles = []
        console.log(response.data,"xdd")
        response.data.forEach(element =>{
            let json = {
                "user": element.user,
                "ip":   element.ip
            }
            disponibles.push(json);
        })
        res.status(200).send(disponibles)

    }).catch((error)=>{res.send(error.response.data)});

})



server.listen(5001, function () {
    console.log('ya estoy corriendo en el 5001')
});