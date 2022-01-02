import express from "express";
import { studentRouter } from "./student.js";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

//postman link : https://www.getpostman.com/collections/dcf01ba2b6eae2f1dc03

const app = express();
dotenv.config();
const PORT = process.env.PORT || 9000;
const MONGO_URL = process.env.MONGO_URL;
app.use(express.json())

async function createConnection() {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("connected successfully")
    return client ;
}
export const client = await createConnection();

app.get("/",async(req,resp) => {
        resp.send("Hello World");
})

app.use("/students",studentRouter)

app.listen(PORT, () => {console.log("server started")})
