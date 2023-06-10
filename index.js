const express = require("express");
const app = express();
var cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;

// middleware for server
dotenv.config();
app.use(cors());
app.use(express.json());

// mongoDB starts Here

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lvw8wzq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   },
});

async function run() {
   try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();

      // ?here is starting all operations

      const quoteCollection = client.db("translinguaDB").collection("quotes");
      const instructorCollection = client.db("translinguaDB").collection("instructors");
      const classCollection = client.db("translinguaDB").collection("classes");

      // !jwt token create and post

      app.post("/jwt", (req, res) => {
         const user = req.body;
         const token = jwt.sign({ user }, process.env.PRIVATE_KEY, { expiresIn: "1h" });
         res.send(token);
      });

      // ?its quotes api

      app.get("/quotes", async (req, res) => {
         const quotes = await quoteCollection.find({}).toArray();
         const result = quotes[parseInt(Math.round(Math.random() * 100))];
         res.send(result);
      });

      // ? there are instructor apis

      app.get("/instructors", async (req, res) => {
         const result = await instructorCollection.find({}).sort({ current_students: -1 }).toArray();
         res.send(result);
      });

      app.get("/instructor/:id", async (req, res) => {
         const id = req.params.id;
         const result = await instructorCollection.findOne({ _id: new ObjectId(id) });
         res.send(result);
      });

      // ?Here popular classes apis

      app.get("/popular_classes", async (req, res) => {
         const result = await classCollection
            .find({ status: "approved" })
            .sort({ current_students: -1 })
            .toArray();

         res.send(result.slice(0, 6));
      });

      app.get("/classes", async (req, res) => {
         const result = await classCollection.find({}).toArray();
         res.send(result);
      });

      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
      // Ensures that the client will close when you finish/error
      //   await client.close();
   }
}
run().catch(console.dir);

app.get("/", (req, res) => {
   res.send("Hello World!");
});

app.listen(port, () => {
   console.log(`Example app listening on port ${port}`);
});
