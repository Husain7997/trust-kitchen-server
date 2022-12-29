const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Server Runing')
// });



const uri = `mongodb+srv://${process.env.DB_Username}:${process.env.DB_Password}@cluster0.molyssj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    const servicesCollection = client.db("trustKitchen").collection("services");
    const reviewCollection = client.db("trustKitchen").collection("review");
    // const addServiceCollection = client.db("trustKitchen").collection("addService");
    app.get("/", async (req, res) => {
      const size=parseInt(req.query.size)
     
      const query = {};
      const cursor = servicesCollection.find(query);
      const home = await cursor.limit(size).toArray();
      res.send(home);
    });

    app.get("/services", async (req, res) => {
      const query = {}
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
   

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.send(service);
    });

    app.get('/myreview', async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email
        };
      }
      const cursor = reviewCollection.find(query);
      const myreview = await cursor.toArray();
      res.send(myreview);
    });
    app.get('/review', async (req, res) => {
      // const id = req.params.id;
      let query = {};
      if (req.params.id) {
        query = {
          id: req.query.id
        };
      }
      const cursor = reviewCollection.find(query);
      const review = await cursor.toArray();
      res.send(review);
    });

    app.post('/review', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    })
    app.post('/addService', async (req, res) => {
      const addService = req.body;
      const result = await servicesCollection.insertOne(addService);
      res.send(result);
    })

    app.put('/review/:id', async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          status: status
        }
      };
      const result = await reviewCollection.updateOne(query, updatedDoc,options);
      res.send(result);
    });

    app.delete('/review/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    })

  } finally {

  }



};
run().catch(err => console.log(err))
app.listen(port, () => {
  console.log(`trust kitchin server running on port ${port}`)
});