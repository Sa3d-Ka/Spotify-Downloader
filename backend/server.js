import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import urlRoute from './routes/urlRoute.js';


const app = express()
const port = process.env.PORT || 4000;


app.use(express.json())
app.use(cors())


app.get('/',(req,res)=>{
    res.send("API WORKING")
})

// api endpoints
app.use('/api/playlist', urlRoute)


app.listen(port, ()=> console.log("Server Started http://localhost:" + port))