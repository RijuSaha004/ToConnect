import "dotenv/config";
import jwt from "jsonwebtoken"

export const generateJwtToken = (id) => {
  if (!process.env.TOKEN_KEY) {
    throw new Error("JWT secret key is not defined");
  }

  return jwt.sign({ id }, process.env.TOKEN_KEY);
};