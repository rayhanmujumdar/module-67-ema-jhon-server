const express = require('express')
require('dotenv').config()
const port = process.env.PORT || 5000
const app = express()
// middleware
const cors = require("cors")
app.use(cors())
app.use(express.json())





const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vpb7z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async () => {
    try{
        await client.connect()
        const emaJhonCollection = client.db('emaJohn').collection('product')
        app.get('/product',async (req,res) => {
            // 0 ---> skip: 0*10 = 0  get: 0-10(10)
            // 1 ---> skip: 1*10 = 10 get: 11-20(10)
            // 2 ---> skip: 2*20 = 20 get: 21-30(10)
            // 3 ---> skip: 3*30 = 30 get: 31-40(10)

            const page = parseInt(req.query.page)
            const size = parseInt(req.query.size)
            const cursor = emaJhonCollection.find({})
            let product;
            if(page || size){
                product = await cursor.skip(page*size).limit(size).toArray()
            }
            else{
                product = await cursor.toArray()
            }
            res.send(product)
        })

        app.get("/productCount",async (req,res) => {
            const count = await emaJhonCollection.estimatedDocumentCount()
            res.send({count})
        })

        //use post to get products by ids
        app.post('/productByKey',async (req,res) => {
            const keys = req.body
            const ids = keys.map(key => ObjectId(key))
            const query = {_id: {$in: ids}}
            const cursor = emaJhonCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
    }
    finally{

    }
}

run().catch(console.dir)

app.listen(port,() => {
    console.log("jhon is runing on port is ",port)
})