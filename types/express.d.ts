// types/express.d.ts
declare namespace Express {
  export interface Request {
    user: { userId: string; name: string; email: string };
  }
}
