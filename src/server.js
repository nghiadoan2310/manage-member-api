import express from 'express'

import viewEngine from './config/viewEngine'
import initWebRoutes from './routes/web'
//import connection from './config/connectDB'

const host = 'localhost'
const port = 8080

const app = express()

//connection()

//config view engine
viewEngine(app)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//config web routes 
initWebRoutes(app)

app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`)
})
