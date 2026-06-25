import {body} from "express-validator";

export const createMessageValidation = [
    body("content")
    .notEmpty()
    .withMessage("Message content is required"),

    body("channelId")
    .notEmpty()
    .withMessage("Channel ID is required"),
];