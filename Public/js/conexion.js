const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017'; 
const client = new MongoClient(url);

async function probarConexion() {
  try {
    await client.connect();
    
    console.log("¡Conexión exitosa!");
    
  } catch (error) {
    console.error("Hubo un error al conectar:", error);
  } finally {

    await client.close();
    
  }
}

probarConexion();