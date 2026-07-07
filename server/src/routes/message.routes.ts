import { Router } from "express";

import {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
} from "../controllers/message.controller";

import { verifyToken } from "../middleware/verifyToken";
import { validate } from "../middleware/validate";
import { createMessageValidation } from "../validators/message.validator";

const router = Router();

router.use(verifyToken);

router.get("/", getMessages);

router.post(
  "/",
  createMessageValidation,
  validate,
  createMessage
);

router.patch("/:id", updateMessage);

router.delete("/:id", deleteMessage);

export default router;