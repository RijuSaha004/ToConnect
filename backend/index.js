import 'dotenv/config'
import { connectDB } from './db/db.js';
import server from './app.js';

const url = process.env.MONGO_URL;
const port = process.env.PORT || 3000;


connectDB(url)
  .then(() => {
    console.log("DB connected");
// App is connected after the database connection is established
    server.listen(port, () => {
      console.log(`App is listing on port : ${port}`);
    });
  })
  .catch((error) => {
    console.log("Server connection failed !!! : ", error);
  });
