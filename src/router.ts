import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  console.log(req.ip);
  res.json({ msg: "hello " });
});

export { router };
