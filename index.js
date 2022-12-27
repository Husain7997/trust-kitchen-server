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

    // const result = await servicesCollection.insertOne(service);
    // console.log(result);

    app.get("/services", async (req, res) => {
      const query = {}
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    app.get("/", async (req, res) => {
      const query = {$limit:3};
      const cursor = servicesCollection.find(query);
      const home = await cursor.toArray();
      res.send(home);
    });

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
  const service = await servicesCollection.findOne(query);
    res.send(service);
  })

} finally {

}

  

};
run().catch(err => console.log(err))
app.listen(port, () => {
  console.log(`trust kitchin server running on port ${port}`)
});