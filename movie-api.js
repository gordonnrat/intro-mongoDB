const PORT = 3000
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()


app.use(cors())



const uri = "";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


let movieList = ['Them Avengers', 'All Dogs Go To Heaven', 'The Aristocats', 'The Brave Little Toaster', 'The Lord of the Rings', 'The Revenant', 'Cats & Dogs'];

// const result = await collection.find({ title: { $regex: /^a/i } }).toArray();

app.route('/all')
  .get(async (req, res) => {
    let error = null;
    let result = [];
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      const collection = client.db("cfa-classwork").collection("basic-api-movies");
  
      result = await collection.find({}).toArray();
      
      console.log();
  
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } 
    catch (e) {
      console.dir(e);
      error = e;
    }
    finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  
    if (error === null) {
      res.json(result.map((value) => {
        return value.title;
      }))
    } 
    else {
      res.status(500).send("Failure");
    }
  })
  .delete(async ( req, res) => {
    let result = [];
    let error = null;
    try {
      await client.connect();
      const collection = client.db("cfa-classwork").collection("basic-api-movies");
      result = await collection.deleteMany({});
      console.log(result);
    }
    catch(e) {
      console.dir(e)
      error = e;
    }
    finally {
      await client.close;
    }
    if (error === null) {
      res.sendStatus(200);
      }
    else {
      res.status(500).send("Failure");
    }
  })

app.get('/find', async (req, res) => {
  let error = null;
  let result = [];
  if (req.query.hasOwnProperty('contains')) {
    try {
      await client.connect();
      const collection = client.db("cfa-classwork").collection("basic-api-movies");
      console.log(req.query.contains);
      result = await collection.find({
        title: {
          $regex: new RegExp(req.query.contains, 'i')
        }
      }).toArray();
      console.log(result);
  
      if(error === null) {
        res.json(result.map(value => {
          return value.title;
        }))
      } else {
        res.status(500).send("Failure");
      }
    }
    catch (e) {
      console.dir(e);
      error = e;
    }
    finally {
      await client.close();
    }
  } else if (req.query.hasOwnProperty('startsWith')) {
    try{
      await client.connect();
      const collection = client.db("cfa-classwork").collection("basic-api-movies");
      result = await collection.find({
        title: {
          $regex: new RegExp(req.query.startsWith, 'i')
        }
      }).toArray();
      console.log(result);
      if(error === null) {
        res.json(result.map(value => {
          return value.title;
        }))
      } else {
        res.status(500).send("Failure");
      }
    }    
    catch (e) {
      console.dir(e);
      error = e;
    }
    finally {
      await client.close();
    }
  }
})

app.route('/insert')
 .post(async (req, res) => {
  let error = null;
  let result = [];
  try{
    await client.connect();
    const collection = client.db("cfa-classwork").collection("basic-api-movies");
    insertList = [
      { "title": "The Avengers 2" },
      { "title": "All Dogs Go To Heaven 2" },
      { "title": "The Aristocats 2" },
      { "title": "The Brave Little Toaster 2" },
      { "title": "The Lord of the Rings 2" },
      { "title": "The Revenant 2" },
      { "title": "Cats & Dogs 2" }
    ]
    result = await collection.insertMany(insertList);
    if(error === null) {
      res.sendStatus(200);
    } else {
      res.status(500).send("Failure");
    }
  }
  catch (e) {
    console.dir(e);
    error = e;
  }
  finally {
    await client.close();
  }
 })

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
