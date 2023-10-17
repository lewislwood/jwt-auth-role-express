import {app} from "./api/app";
import dotenv from "dotenv";

dotenv.config();

const server = app;

const { API_PORT } = process.env;


server.listen(API_PORT, () => {
  console.log(`Server running on port ${API_PORT}`);
});
