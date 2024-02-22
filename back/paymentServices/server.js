import dotenv from 'dotenv';
import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'

dotenv.config()

const PROTO_PATH = process.env.PROTO_PATH;


const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const serviceProto = grpc.loadPackageDefinition(packageDefinition);

const HOST = '0.0.0.0:8080';

class ProductService {
  addProduct(call, callback) {
    console.log('Request is received:', call.request);
    callback(null, { status_code: 1 });
  }
}

const server = new grpc.Server();

server.addService(serviceProto.ProductService.service, new ProductService());
server.bindAsync(HOST, grpc.ServerCredentials.createInsecure(),(err, port) => {
  if (err != null) {
    return console.error(err);
  }
  console.log(`gRPC listening on ${port}`)
});

console.log('Service is running...');
