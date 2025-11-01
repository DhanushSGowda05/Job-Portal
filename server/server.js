import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import './config/instrument.js'
import * as Sentry from "@sentry/node"
import { clerkWebHooks } from './controllers/webhooks.js'

const app=express()
// connect to database

await connectDB()

app.use(cors())
app.use(express.json())


app.get('/',(req,res)=> res.send("api working"))

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.post("/webhooks",clerkWebHooks)


const PORT = process.env.PORT || 5000
Sentry.setupExpressErrorHandler(app);


app.listen(PORT,() => {
    console.log(`server is running on ${PORT}`)
})