const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

//  Check env variable FIRST
if (!process.env.MONGO_URI) {
    console.error(" MONGO_URI missing in environment variables");
    process.exit(1); // Render pe crash clear dikhega
}

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

let collection;

//  Connect MongoDB properly
async function connectDB() {
    try {
        await client.connect();
        console.log(" MongoDB Connected");

        const db = client.db("college_app");
        collection = db.collection("RegisterStudents");

    } catch (err) {
        console.error(" MongoDB Connection Error:", err);
        process.exit(1);
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
        if (!collection) {
            throw new Error("Database not connected yet");
        }

        await collection.insertOne(req.body);

        res.json({ message: "Student Registered" });

    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
