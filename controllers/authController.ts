// controllers/authController.ts
import { Request, Response } from "express";
import ApiError from "../utils/ApiError";
import { addDoc, getDocs, query, where } from "firebase/firestore";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { usersRef, userConverter } from "../models/User"; // Update the path to where you defined these

// TODO: Add input validation
export const register = async (req: Request, res: Response) => {
  try {
    const q = query(usersRef, where("email", "==", req.body.email));
    const snap = await getDocs(q);

    if (snap.size > 0) {
      return res.status(400).send({ message: "User already exist" });
    }
    const hashPassword = await hash(req.body.password, 10);

    await addDoc(usersRef.withConverter(userConverter), {
      ...req.body,
      password: hashPassword,
    });

    res.status(201).send({
      message: "User registered successfully",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).send({ message: error.message });
    } else {
      res.status(500).send({ message: "Internal server error" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const q = query(
      usersRef,
      where("email", "==", req.body.email)
    ).withConverter(userConverter);

    const snap = await getDocs(q);

    if (snap.empty) {
      return res.status(400).send({ message: "Credentials not found" });
    }
    const userDoc = snap.docs[0];
    const { email, name, password } = userDoc.data();

    const isMatch = await compare(req.body.password, password);

    if (!isMatch) {
      return res.status(400).send({ message: "Credentials not found" });
    }

    const token = sign({ userId: userDoc.id, email, name }, "secret", {
      expiresIn: "8h",
    });

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      sameSite: "lax",
    });

    res.status(200).send({
      message: "User logged in successfully",
      data: { email, name, token },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).send({ message: error.message });
    } else {
      res.status(500).send({ message: "Internal server error" });
    }
  }
};
