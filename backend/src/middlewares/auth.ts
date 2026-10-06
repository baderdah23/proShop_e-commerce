import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { findUserById } from "../models/auth/auth.repository.js";

interface DecodedToken {
  id: string;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, No token" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as DecodedToken;
    const userId: string = decoded.id;

    const result = await findUserById(userId);

    if (result.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, user not found" });
    }

    (req as any).user = result[0];
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }
};
