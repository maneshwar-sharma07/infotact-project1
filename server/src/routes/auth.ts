import { Router } from "express";

const router = Router();

router.post("/register", (req, res) => {
  const { name, email } = req.body;

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      name,
      email,
    },
    token: "dummy-token",
  });
});

router.post("/login", (req, res) => {
  const { email } = req.body;

  return res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      email,
    },
    token: "dummy-token",
  });
});

export default router;