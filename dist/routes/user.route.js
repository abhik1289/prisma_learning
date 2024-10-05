// src/routes/user.routes.ts
import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();
router.post("/add-user", async (req, res) => {
    console.log("first");
    const { name, email, password, phoneNumber } = req.body;
    try {
        // Create a new user with the provided data
        const newUser = await prisma.user.create({
            data: {
                name, // use the values from the request body
                email,
                password,
                phoneNumber, // optional if not defined in your schema
            },
        });
        // Send back the created user as the response
        res.status(201).json({
            message: "User created successfully",
            user: newUser,
        });
    }
    catch (error) {
        // Error handling for any issues during user creation
        console.error("Error creating user: ", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
});
export default router;
