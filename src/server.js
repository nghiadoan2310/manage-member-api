import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import viewEngine from './config/viewEngine'
import initWebRoutes from './routes/web'
import { corsOptions } from './config/cors'
import initApiRoutes from './routes/api'
//import connection from './config/connectDB'

const host = 'localhost'
const port = 8080

const app = express()

//connection()

app.use(cookieParser())

//config cors
app.use(cors(corsOptions))

//config view engine
viewEngine(app)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//config web routes 
initWebRoutes(app)

//config api routes
initApiRoutes(app)

app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`)
})
