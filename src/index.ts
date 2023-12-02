import * as dotenv from "dotenv";
import { app } from "./server";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("serve on http://localhost:" + PORT);
});
