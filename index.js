const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j5nrexn.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    // collection
    const foodCollection = client.db('foodBuzz').collection('foods');

    // food related api
    app.get('/limitFoods', async(req,res)=>{
        const result = await foodCollection.find().limit(6).sort({ "quantity": -1 }).toArray();
        res.send(result);
    })

    app.get('/foods', async(req,res)=>{
        const result = await foodCollection.find().toArray();
        res.send(result);
    })

    app.get('/foods/:id', async(req,res)=>{
        const id = req.params.id;
        const query = { _id : new ObjectId(id)};
        const result = await foodCollection.findOne(query);
        res.send(result);
    })

    app.post('/createFood', async(req,res)=>{
      const food = req.body;
      const result = await foodCollection.insertOne(food);
      res.send(result);
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Community food server is running");
});

app.listen(port, (req, res) => {
  console.log(`Community food server is running on port ${port}`);
});
