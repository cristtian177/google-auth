const { Client } = require("pg");

/*
const connectionData = {
    user: "postgres",
    host: "localhost",
    database: "users",
    password: "password",
    port: 5432,
};
*/

require("dotenv").config();

const client = new Client(process.env.DATABASE_URL);

client
    .connect()
    .then((response) => {
        console.log("conexion inciada");
        client.end();
    })
    .catch((err) => {
        client.end();
    });
