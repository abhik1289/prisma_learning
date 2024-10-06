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

router.post("/create-post", async (req: Request, res: Response) => {
  const postData = {
    id: "60d5ec49e0f4a531f8e4f1f3", // This is auto-generated and usually you don't set it manually
    title: "Exploring the Mountains",
    postType: "Green",
    photo: {
      create: {
        height: 300,
        width: 400,
        url: "https://example.com/photo1.jpg",
      },
    },
    userId: "6701947f535bc9efc2030227", // Replace with actual User ID
  };
  const createdPost = await prisma.user.create({
    include: {
      posts: true,
    },
    data: {
      name: "Avik", // use the values from the request body
      email: "acb78xc@example.com",
      password: "password",
      role: "admin",
      age: 12,
      isActive: false,
      phoneNumber: "9876453432", //

      posts: {
        create: [
          {
            title: "Title 10",
            postType: "Green",
            photos: [
              {
                height: 300,
                width: 400,
                url: "https://example.com/photo1.jpg",
              },
              {
                height: 300,
                width: 400,
                url: "https://example.com/photo2.jpg",
              },
            ],
            // userId: "6701947f535bc9efc2030227",
          },
          {
            title: "Title 20",
            postType: "Red",
            // userId: "6701947f535bc9efc2030227",
          },
          {
            title: "Title 30",
            postType: "Blue",
            // userId: "6701947f535bc9efc2030227",
          },
          {
            title: "Title 40",
            postType: "Green",
            // userId: "6701947f535bc9efc2030227",
          },
        ],
      },
    },
  });
  console.log(`Post created: `, createdPost);
  res.json({ createdPost });
});

// complex data fetching

// router.get("/get-data-1/:email", async (req, res) => {
//   try {
//     const data = await prisma.user.findUnique({
//       where: {
//         email: req.params.email,
//       },
//       select: {
//         name: true,
//         email: true,
//         age: true,
//         posts: {
//           select: {
//             title: true,
//           },
//         },
//       },
//     });
//     res.json({ data });
//   } catch (error) {
//     console.log(error);
//   }
// });

router.get("/get-data-1/:email", async (req, res) => {
  try {
    const data = await prisma.user.findMany({
      // relationLoadStrategy: "join", // or 'query'
      select: {
        posts: true,
      },
    });
    res.json({ data });
  } catch (error) {
    console.log(error);
  }
});

export default router;
