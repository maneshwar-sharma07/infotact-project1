import {body} from 'express-validator';

export const createChannelValidation =[
    body("name")
    .notEmpty()
    .withMessage("Channel name is required"),

    body("workspaceId")
    .notEmpty()
    .withMessage("Workspace ID is required")
];