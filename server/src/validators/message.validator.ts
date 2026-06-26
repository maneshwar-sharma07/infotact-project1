import {body} from "express-validator";

export const createMessageValidation = [
    body("content")
    .trim()
    .notEmpty()
    .withMessage("Message content is required")
    .isLength({max:1000})
    .withMessage("Message content cannot exceed 1000 characters"),

    body("channelId")
    .notEmpty()
    .withMessage("Channel ID is required"),
];