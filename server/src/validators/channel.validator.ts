import {body} from 'express-validator';

export const createChannelValidation =[
    body("name")
    .trim()
    .notEmpty()
    .withMessage("Channel name is required")
    .isLength({min:2,max:30})
    .withMessage("Channel name must be between 2 and 30 characters"),

    body("workspaceId")
    .notEmpty()
    .withMessage("Workspace ID is required")
];