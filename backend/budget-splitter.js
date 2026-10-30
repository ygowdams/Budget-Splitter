const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Trip = require("./model/trip");
const Expense = require("./model/expenses");

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});


// MongoDB Connection
async function connectDB() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not configured");
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB Atlas Connected Successfully");

    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        throw error;
    }
}


// Home
app.get("/", (req, res) => {
    res.send("Travelling Budget Splitter API is running");
});


// =====================================================
// TRIP APIs
// =====================================================


// CREATE TRIP
app.post("/api/trips", async (req, res) => {
    try {

        const trip = await Trip.create(req.body);

        res.status(201).json({
            message: "Trip created successfully",
            trip: trip
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
});


// READ ALL TRIPS
app.get("/api/trips", async (req, res) => {
    try {

        const trips = await Trip.find();

        res.json(trips);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});


// READ ONE TRIP
app.get("/api/trips/:id", async (req, res) => {
    try {

        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        res.json(trip);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
});


// UPDATE TRIP
app.put("/api/trips/:id", async (req, res) => {
    try {

        const trip = await Trip.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        res.json({
            message: "Trip updated successfully",
            trip: trip
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
});


// DELETE TRIP
app.delete("/api/trips/:id", async (req, res) => {
    try {

        const trip = await Trip.findByIdAndDelete(
            req.params.id
        );

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        // Delete expenses belonging to this trip
        await Expense.deleteMany({
            tripId: req.params.id
        });

        res.json({
            message: "Trip deleted successfully",
            trip: trip
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
});

// =====================================================
// ADD MEMBER
// =====================================================

app.post("/api/trips/:id/members", async (req, res) => {
    try {

        const { name } = req.body;

        console.log("Adding member:", name);
        console.log("Trip ID:", req.params.id);

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Member name is required"
            });
        }

        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        trip.members.push(name.trim());

        await trip.save();

        res.json({
            message: "Member added successfully",
            trip: trip
        });

    } catch (error) {

        console.error("ADD MEMBER ERROR:", error);

        res.status(400).json({
            message: error.message
        });

    }
});

// =====================================================
// REMOVE MEMBER
// =====================================================

app.delete(
    "/api/trips/:id/members/:memberName",
    async (req, res) => {

        try {

            const trip = await Trip.findById(req.params.id);

            if (!trip) {
                return res.status(404).json({
                    message: "Trip not found"
                });
            }

            const memberName = req.params.memberName;

            trip.members = trip.members.filter(
                member => member !== memberName
            );

            await trip.save();

            res.json({
                message: "Member removed successfully",
                trip: trip
            });

        } catch (error) {

            console.error("REMOVE MEMBER ERROR:", error);

            res.status(400).json({
                message: error.message
            });

        }

    }
);

// =====================================================
// EXPENSE APIs
// =====================================================


// CREATE EXPENSE
app.post("/api/expenses", async (req, res) => {
    try {

        const expense = await Expense.create(req.body);

        res.status(201).json({
            message: "Expense added successfully",
            expense: expense
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
});


// READ ALL EXPENSES
app.get("/api/expenses", async (req, res) => {
    try {

        const expenses = await Expense.find();

        res.json(expenses);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});


// READ EXPENSES OF ONE TRIP
app.get("/api/expenses/trip/:tripId", async (req, res) => {
    try {

        const expenses = await Expense.find({
            tripId: req.params.tripId
        });

        res.json(expenses);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
});


// READ ONE EXPENSE
app.get("/api/expenses/:id", async (req, res) => {
    try {

        const expense = await Expense.findById(
            req.params.id
        );

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.json(expense);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
});


// UPDATE EXPENSE
app.put("/api/expenses/:id", async (req, res) => {
    try {

        const expense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.json({
            message: "Expense updated successfully",
            expense: expense
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
});


// DELETE EXPENSE
app.delete("/api/expenses/:id", async (req, res) => {
    try {

        const expense = await Expense.findByIdAndDelete(
            req.params.id
        );

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.json({
            message: "Expense deleted successfully",
            expense: expense
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
});


// =====================================================
// START SERVER
// =====================================================

// START SERVER
async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`TripSplit backend running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
}

startServer();