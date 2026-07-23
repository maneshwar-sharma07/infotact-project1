import { Router } from "express";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "../controllers/notification.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();
router.use(verifyToken);
router.get("/", getNotifications);
router.patch("/read-all", markAllNotificationsRead);
router.patch("/:id/read", markNotificationRead);
export default router;
