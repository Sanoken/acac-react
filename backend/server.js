require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Database Connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test Route
app.get("/", (req, res) => {
    res.send("User Management API is Running!");
});

// 📌 Get all contacts
app.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM acac_users ORDER BY id ASC");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// 📌 Add a new contact
app.post("/users", async (req, res) => {
    const { name, discord, lodestoneid, raidmember, ninemember, admin, lodestoneimage } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO acac_users (name, discord, lodestoneid, raidmember, ninemember, admin, lodestoneimage) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [name, discord, lodestoneid, raidmember, ninemember, admin, lodestoneimage]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error Adding user");
    }
});

// 📌 Update a user
app.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { name, discord, lodestoneid, raidmember, ninemember, admin, lodestoneimage } = req.body;
    try {
        const result = await pool.query(
            "UPDATE acac_users SET name=$1, discord=$2, lodestoneid=$3, raidmember=$4, ninemember=$5, admin=$6, lodestoneimage=$7 WHERE id=$8 RETURNING *",
            [name, discord, lodestoneid, raidmember, ninemember, admin, lodestoneimage, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error Updating User");
    }
});

// 📌 Delete a user
app.delete("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM acac_users WHERE id=$1", [id]);
        res.send(`User with ID ${id} deleted.`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error Deleting user");
    }
});

// Start the Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
