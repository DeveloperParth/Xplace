import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import routes from "./routes";
import { config } from "dotenv";
import ApiError from "./utils/ApiError";
import db from "./db";

const app = express();
config();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
routes(app);

app.use((err: ApiError, _: Request, res: Response, next: NextFunction) => {
  return res.status(err.status || 500).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
});
async function seedDb () {
  console.log("Seeding database...");
  await db.user.create({
    data: {
      email: "parth",
      password: "password",
      name: "Parth",
    },
  });
  console.log("Database seeded!");
  
}
app.listen(3000, () => {
  // seedDb();
  console.log("Server is running on port 3000");
});
