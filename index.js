const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app =express();
const port = process.env.PORT || 5000;
//app.use(cors());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5174', // Replace with the origin of your frontend application
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  }));
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.265tqpu.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    await client.connect();
    const categoryCollection = client.db('jobDB').collection('category');
    const userCollection = client.db('jobDB').collection('user');
    const jobCollection = client.db('jobDB').collection('job');
    const applyCollection = client.db('jobDB').collection('apply');
    app.post('/category',async(req,res)=>{
        const newCategory = req.body;
        console.log(newCategory);
        const result = await categoryCollection.insertOne(newCategory);
        res.send(result);
    })
    app.post('/apply',async(req,res)=>{
        const newApply = req.body;
        console.log(newApply);
        const result = await applyCollection.insertOne(newApply);
        res.send(result);
    })

    app.get('/category',async(req,res)=>{
        const cursor = categoryCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    app.post('/job',async(req,res)=>{
        const newJob = req.body;
        console.log(newJob);
        const result = await jobCollection.insertOne(newJob);
        res.send(result);
    })
    app.get('/job',async(req,res)=>{
        const cursor = jobCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    app.get('/job/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await jobCollection.findOne(query);
        res.send(result);
    })
    app.get('/apply',async(req,res)=>{
        const cursor = applyCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    app.post('/user', async (req, res) => {
        const user = req.body;
        console.log(user);
        const result = await userCollection.insertOne(user);
        res.send(result);
    });
    app.get('/user', async (req, res) => {
        const cursor = userCollection.find();
        const users = await cursor.toArray();
        res.send(users);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Find Jobs')
  })
   
  app.listen(port, () => {
    console.log(`Find Job Port is ${port}`)
  })