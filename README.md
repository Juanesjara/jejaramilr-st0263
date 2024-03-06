# ST0263-5886     <nombre>
#
# Juan Esteban Jaramillo Ramos jejaramilr@eafit.edu.co
#
# Alvaro Enrique Ospina Sanjuan aeospinas@eafit.edu.co
#
# 
# Reto No 1 y 2
#
# 1. breve descripción de la actividad
# 
Se realizo el diseño e implementación de un sistema P2P donde cada nodo / proceso contiene uno o más microservicios que soportan un sistema de compartición de archivos distribuido y centralizado.

## 1.1. Que aspectos cumplió o desarrolló de la actividad propuesta por el profesor (requerimientos funcionales y no funcionales)
Se cumplio la creacion de un servidor directorio con la capacidad de crear almacenar y borrar servidores clientes que tengan archivos. tambien se cumplio con la creacion de un servidor-cliente que se puede comunicar con el servidor directorio mediante api-rest y tambien se puede comunicar con otros servidores cliente mediante grpc

## 1.2. Que aspectos NO cumplió o desarrolló de la actividad propuesta por el profesor (requerimientos funcionales y no funcionales)
no se cumplio la funcion upload que hacia que mediante grpc los servidores cliente se cargan los archivos

# 2. información general de diseño de alto nivel, arquitectura, patrones, mejores prácticas utilizadas.
El tipo de arquitectura que se usará es P2P no estructurada basada en servidor de directorio y localización. Primero, porque al no ser estructurada, todos los nodos son iguales, es decir, que no hay un servidor central que genere cuello de botella, también ayuda a que sea más escalable la aplicación. 
# 3. Descripción del ambiente de desarrollo y técnico: lenguaje de programación, librerias, paquetes, etc, con sus numeros de versiones.
primero se debe hacer npm install en la carpita raiz y luego entrar a en la carpeta pserver y hacer npm install tambien, luego para ejecutar el servidor directorio en la carpeta raiz ejecutamos `nodemon dserver.js` para crear los servidores-clientes se accede a la carpeta pserver y hacemos `nodemon pserver.js`. y ahi tendriamos un servidor-cliente si quisieramos crear mas seria copiar el archivo y cambiar los puerto o las ip para ya luego correrlo tambien

# 4. Descripción del ambiente de EJECUCIÓN (en producción) lenguaje de programación, librerias, paquetes, etc, con sus numeros de versiones.
para este reto no se implemento el ambiente en produccion por problemas con las credenciales de aws



# referencias:
https://www.youtube.com/watch?v=psYAhc9JUyo
https://blog.logrocket.com/communicating-between-node-js-microservices-with-grpc/
https://grpc.io/
https://www.youtube.com/watch?v=5xlwFWakNvA&t=347s
