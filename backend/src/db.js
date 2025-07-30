import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false
});

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("? DB connected");
  } catch (err) {
    console.error("? DB connection error:", err.message);
    process.exit(1);
  }
}
