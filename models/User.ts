import {
  collection,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import { db } from "../config/firebaseInit";

class User {
  id: string;
  name: string;
  email: string;
  password: string;
  constructor(id: string, name: string, email: string, password: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }
}

const userConverter = {
  toFirestore: (user: User) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<User>,
    options: SnapshotOptions | undefined
  ) => {
    const data = snapshot.data(options);
    return new User(snapshot.id, data.name, data.email, data.password);
  },
};

const usersRef = collection(db, "USERS").withConverter(userConverter);

export { User, usersRef, userConverter };
