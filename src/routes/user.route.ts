// src/routes/user.routes.ts
import express, { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router: Router = express.Router();

//create user
router.post("/add-user", async (req: Request, res: Response) => {
  console.log("first");
  const { name, email, password, phoneNumber, role, age, isActive } = req.body;

  try {
    // Create a new user with the provided data
    const newUser = await prisma.user.create({
      data: {
        name, // use the values from the request body
        email,
        password,
        role,
        age,
        isActive,
        phoneNumber, // optional if not defined in your schema
      },
    });

    // Send back the created user as the response
    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error: any) {
    // Error handling for any issues during user creation
    console.error("Error creating user: ", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

//find unique
router.get("/get-user/:email", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.params.email,
    },
    select: {
      email: true,
      name: true,
    },
  });
  res.json({ user });
});

// find all user
router.get("/all-user", async (req, res) => {
  const user = await prisma.user.findMany();
  res.json({ user });
});

//findFirst

router.get("/find-first", async (req, res) => {
  const user = await prisma.user.findFirst({
    where: {
      age: {
        gt: 50,
      },
    },
    orderBy: {
      id: "desc",
    },
  });
  res.json({ user });
});

//find Many

router.get("/find-many", async (req, res) => {
  const user = await prisma.user.findMany({
    where: {
      email: {
        endsWith: ".in",
      },
    },
    orderBy: {
      id: "desc",
    },
  });
  res.json({ user });
});

//update user
router.put("/update-user/:email", async (req, res) => {
  const updateUser = await prisma.user.update({
    where: {
      email: "emma.thompson@site.uk",
    },
    data: {
      name: "Viola the Magnificent",
    },
  });
  res.json({ updateUser });
});

//update many
router.put("/update-many/:email", async (req, res) => {
  const updateUser = await prisma.user.updateMany({
    where: {
      email: {
        contains: ".in",
      },
    },
    data: {
      role: "moderator",
    },
  });
  res.json({ updateUser });
});

//update upsert
router.put("/update-upsert/:email", async (req, res) => {
  const updateUser = await prisma.user.upsert({
    where: {
      email: "viola@prisma.io",
    },
    update: {
      name: "Viola the Magnificent",
    },
    create: {
      email: "viola@prisma.io",
      name: "viola",
      phoneNumber: "1234567890",
      password: "hashed_password_1",
      role: "admin",
      age: 45,
      isActive: false,
    },
  });
  res.json({ updateUser });
});

export default router;
