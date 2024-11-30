import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const uri = process.env.MONGODB_URI;
console.log(uri);
if (!uri) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

const client = new MongoClient(uri, {
  //update for server configuration on render
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: true,
});

let db;

async function connectToDb() {
  try {
    await client.connect(uri);
    console.log("Connected to MongoDB");
    db = client.db("appDB");

    // Delete all documents in the shelter collection
    // await db.collection("shelters").deleteMany({});
    // console.log("Cleared shelter collection");
    // Check if collection exists and has documents
    const collections = await db.listCollections({ name: "pets" }).toArray();
    if (collections.length === 0) {
      await initializeData();
    }

    return db;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
}

async function initializeData() {
  try {
    const petsCollection = db.collection("pets");

    const initialPets = [
      {
        color: "Brown and Black",
        name: "Max/kevin",
        kind: "Dog",
        status: "Lost",
        location: "Chandler, MN",
        picture: "/pic/dog1.png",
        description: "Border Collie/German Shepherd mix, very friendly",
      },
      {
        color: "Gray Tabby",
        name: "Susan",
        kind: "Cat",
        status: "Lost",
        location: "Minneapolis",
        picture: "/pic/cat1.png",
        description: "Indoor cat, very shy, wearing a blue collar",
      },
    ];

    const result = await petsCollection.insertMany(initialPets);
    console.log(`${result.insertedCount} documents inserted`);
  } catch (err) {
    console.error("Error initializing data:", err);
    throw err;
  }
}

export { connectToDb, client };
