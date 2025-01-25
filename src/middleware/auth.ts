import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Define a custom user interface for request
interface CustomRequest extends Request {
  user?: { userId: string };  // Optional user object with userId
}

export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  // Ensure JWT_SECRET is loaded
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "JWT_SECRET is not defined" });
  }

  // Extract token from Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // If no token is found, return unauthorized response
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify the token and extract the user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    // Attach user data to the request object
    req.user = { userId: decoded.userId };

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Check for specific JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Token is not valid" });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token has expired" });
    }

    // Generic server error handling
    return res.status(500).json({ message: "Server error" });
  }
};
