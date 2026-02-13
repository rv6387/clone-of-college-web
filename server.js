const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// Static files (HTML / CSS / Images)
app.use(express.static("public"));

// Render ke liye dynamic port
const PORT = process.env.PORT || 3000;

//  MongoDB URI from environment variable
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

let collection;

// Connect MongoDB
async function connectDB() {
    try {
        await client.connect();
        console.log("MongoDB Connected ");

        const db = client.db("college_app");
        collection = db.collection("RegisterStudents");

    } catch (err) {
        console.error("MongoDB Error ", err);
    }
}

connectDB();


// Default Route
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/home.html");
});


// Register API
app.post("/register", async (req, res) => {
    try {
        await collection.insertOne(req.body);
        res.json({ message: "Student Registered " });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} `);
});
