const express = require("express")
const server = express()
const {writeFile, readFile} = require('fs'); 
server.use(express.json());

server.post("/login",  (req, res)=>{
    let {user, password, ip} = req.body;
 
    let objectToSave = {user:user,ip:ip} 
 
    fs.writeFile('directory.json', JSON.stringify(objectToSave),'utf8', (err) => { 
        if (err) throw err; 
        console.log('The file has been saved!'); 
    }); 

    console.log(user, password,ip);
    res.send("recibido")
  
})


server.listen(4000, function () {
    console.log('ya estoy corriendo mi bro en el 4000')
  });