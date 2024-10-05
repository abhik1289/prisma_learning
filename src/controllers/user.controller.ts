import { Request, Response } from "express";

// Correct TypeScript typing for Express handler function
export const createUser = (req: Request, res: Response): Response | void => {
  try {
    const { name, email } = req.body;

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
    };

    // Return a successful response
    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
