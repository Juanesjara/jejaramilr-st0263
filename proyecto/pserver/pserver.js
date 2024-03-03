import dotenv from 'dotenv';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
dotenv.config();

import axios  from "axios"
import express from "express"
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

const HOST = 'localhost:50052'
const grpcserver = new grpc.Server();
 

function main(){
    grpcserver.addService(serviceProto.FileService.service, {AddFile, GetFileByName});
    grpcserver.bindAsync(HOST, grpc.ServerCredentials.createInsecure(),(err, port) => {
        if (err != null) {
            return console.error(err);
        }
        console.log(`gRPC listening on ${port}`)
    });
}
main()


function AddFile(file){
    for (let i = 0; i < file.length; i++) {
        files.includes(file[i])? console.log("ya esta"):files.push(file[i])
    }
    
}

function GetFileByName(nombre){
    
    let index = files.indexOf(nombre)
    let resultado = index == -1 ? files[index]:"No existe el archivo";
    callback(null, {Nombre: resultado}) 
}

function downloadFile(archivo){
    let resultado = files.find(e => e == archivo)
    if(resultado){
        console.log("lo tiene")
    }
}

server.post("/descargar", (req,res)=>{
    let {archivo, link} = req.body;
    const client = new FileService(link, grcp.credentials.createInsecure())
    client.GetFileByName({archivo:archivo},(err,data)=>{
            if(err){
                console.log("error:  " + err);
                res.status(400).send("no se encontro el archivo")
            }else{
                console.log("Respuesta recibida", data)
                res.status(200).send(data);
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
        console.log(response.data)
        let disponibles = []
        response.data.forEach(element =>{
            let json = {
                "user": element.user,
                "ip":   element.ip
            }
            disponibles.push(json);
        })
        res.status(200).send(disponibles)

    }).catch((error)=>{res.send(error)});

})



server.listen(5000, function () {
    console.log('ya estoy corriendo en el 5000')
});