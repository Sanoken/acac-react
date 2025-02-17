require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Retry logic for database connection
const connectWithRetry = async () => {
    const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: "postgres",
        retry: {
            max: 5, // Retry 5 times
            match: [/ECONNREFUSED/],
            backoffBase: 1000, // Start retrying after 1 second
            backoffExponent: 1.5
        },
    });

    try {
        await sequelize.authenticate();
        console.log("Connected to PostgreSQL!");
        
        // Define User Model
        const User = sequelize.define("User", {
            id: {
                type: DataTypes.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            discord: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            lodestoneid: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            raidmember: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            ninemember: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            admin: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },    
            raidmember: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        });

        // Sync Database
        await sequelize.sync();

        // Routes
        app.get("/users", async (req, res) => {
            const users = await User.findAll();
            res.json(users);
        });

        app.post("/users", async (req, res) => {
            const user = await User.create(req.body);
            res.json(user);
        });

        app.put("/users/:id", async (req, res) => {
            await User.update(req.body, { where: { id: req.params.id } });
            res.json({ message: "User updated" });
        });

        app.delete("/users/:id", async (req, res) => {
            await User.destroy({ where: { id: req.params.id } });
            res.json({ message: "User deleted" });
        });

        // Start server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
    } catch (error) {
        console.error("Error connecting to database. Retrying in 5 seconds...");
        setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    }
};

// Start the connection attempt
connectWithRetry();