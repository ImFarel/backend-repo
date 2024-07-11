import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers["authorization"];
  if (!header) {
    return res.status(403).send("A token is required for authentication");
  }

  const token = header.split(" ")[1];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = verify(token, "secret");

    if (
      typeof decoded === "object" &&
      "name" in decoded &&
      "email" in decoded
    ) {
      req.user = decoded as { userId: string; name: string; email: string }; // Explicitly cast to the expected type
      next();
    } else {
      return res.status(401).send("Invalid Token");
    }
  } catch (err) {
    console.error(err);
    return res.status(401).send("Invalid Token");
  }
}
