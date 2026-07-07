import {Router} from 'express';
import {
createMessage,
getMessages,
updateMessage,
deleteMessage,
} from "../controllers/message.controller";

import {verifyToken} from '../middlewares/verifyToken';

const router = Router();

router.use(verifyToken);

router.get("/",getMessages);
router.post("/",createMessage);

router.patch("/:id", updateMessage);

router.delete("/:id", deleteMessage);

export default router;