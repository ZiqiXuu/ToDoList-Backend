import * as express from "express"
import {myDataSource} from "./config/db"
import {TodoController} from './controller/TodoController'
import * as bodyParser from "body-parser";
import cors = require("cors");
import dotenv = require('dotenv');

// establish database connection
myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

// create and setup express app
const app = express()
app.use(express.json())
app.use(bodyParser.json());
app.use(cors());
dotenv.config()

// register routes
app.get("/", TodoController.getTodo)
app.get("/search", TodoController.getByName)
app.post("/insert", TodoController.create)
app.delete("/delete", TodoController.delete)
app.put("/:id", TodoController.update)

// start express server
const PORT = process.env.PORT || 5002
app.listen(PORT)