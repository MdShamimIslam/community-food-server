const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
  },
});

async function run() {
  try {
    // await client.connect();

    // collection

    const foodCollection = client.db("foodBuzz").collection("foods");
    const requestFoodCollection = client
      .db("foodBuzz")
      .collection("requestFoods");

    // FOOD RELATED API
    app.get("/limitFoods", async (req, res) => {
      const result = await foodCollection
        .find()
        .limit(6)
        .sort({ quantity: -1 })
        .toArray();
      res.send(result);
    });

    app.get("/foods", async (req, res) => {
      let query = {};
      let sortObj = {};
      const foodName = req.query.food_name;
      // const sortField = req.query.sortField;
      const sortOrder = req.query.sortOrder;
      // console.log(sortField);
      if (foodName) {
        query = { food_name: foodName };
      }
      if (sortOrder) {
        sortObj = { expired_date: sortOrder };
      }
      const result = await foodCollection.find(query).sort(sortObj).toArray();
      res.send(result);
    });

    app.get("/foods/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await foodCollection.findOne(query);
      res.send(result);
    });

    // createdFood api
    app.get("/createFood", async (req, res) => {
      const email = req.query.email;
      const query = { donator_email: email };
      const result = await foodCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/createFood/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await foodCollection.findOne(query);
      res.send(result);
    });

    app.post("/createFood", async (req, res) => {
      const food = req.body;
      const result = await foodCollection.insertOne(food);
      res.send(result);
    });

    app.delete("/createFood/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await foodCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/createFood/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateFood = req.body;
      const options = { upsert: true };
      const food = {
        $set: {
          food_name: updateFood.food_name,
          food_img: updateFood.food_img,
          quantity: updateFood.quantity,
          expired_date: updateFood.expired_date,
          location: updateFood.location,
          food_Des: updateFood.food_Des,
        },
      };
      const result = await foodCollection.updateOne(filter, food, options);
      res.send(result);
    });

    // REQUEST FOOD RELATED API
    app.get("/requestFood", async (req, res) => {
      const email = req.query.email;
      const query = { requester_email: email };
      const result = await requestFoodCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/requestFood", async (req, res) => {
      const food = req.body;
      const result = await requestFoodCollection.insertOne(food);
      res.send(result);
    });

    app.delete("/requestFood/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await requestFoodCollection.deleteOne(query);
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
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
