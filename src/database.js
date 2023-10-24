const { Client } = require("pg");

/*
DATABASE_URL=postgresql://postgres:password@localhost:5432/users
const connectionData = {
    user: "postgres",
    password: "password",
    host: "localhost",
    port: 5432,
    database: "users",
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
