import {
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { Request, Response } from "express";
import { db } from "../config/firebaseInit";
import { usersRef } from "../models/User";
import { hash } from "bcrypt";

export const fetchUserData = async (req: Request, res: Response) => {
  const pageSize = parseInt(req.query.pageSize as string) || 10;
  const lastVisibleId = req.query.lastVisibleId as string | undefined;

  try {
    let q = query(usersRef, orderBy("__name__"), limit(pageSize));

    if (lastVisibleId) {
      const lastVisibleDocRef = doc(db, "USERS", lastVisibleId);
      const lastVisibleDocSnapshot = await getDoc(lastVisibleDocRef);

      if (lastVisibleDocSnapshot.exists()) {
        q = query(
          usersRef,
          orderBy("__name__"),
          startAfter(lastVisibleDocSnapshot),
          limit(pageSize)
        );
      } else {
        console.error("Document does not exist!");
      }
    }

    const querySnapshot = await getDocs(q);
    const users: Array<any> = [];
    let lastVisible: null | string = null;

    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      users.push({
        id: doc.id,
        name: userData.name,
        email: userData.email,
      });
      lastVisible = doc.id;
    });

    res.json({
      users,
      lastVisibleId: lastVisible,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unknown error occurred");
  }
};

export const updateUserData = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const userIdFromToken = req.user?.userId;

    if (userId !== userIdFromToken) {
      return res
        .status(403)
        .send({ message: "Unauthorized to update this user data" });
    }

    const docRef = doc(db, "USERS", userId);
    // const hashPassword = await hash(req.body.password, 10);

    await updateDoc(docRef, {
      ...req.body,
      // password: hashPassword,
    });

    res.status(200).send({ message: "User data updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to update user data" });
  }
};
