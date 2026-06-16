import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
    id: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
            };
        }
    }
}

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
            return;
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({
                success: false,
                message: "Invalid token format.",
            });
            return;
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as unknown as DecodedToken;

        req.user = {
            id: decoded.id,
        };

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};