import {body} from 'express-validator';

export const createWorkspaceValidation =[
    body("name")
    .notEmpty()
    .withMessage("Workspace name is required")
    .isLength({min:3})
    .withMessage("Workspace name must be at least 3 characters long"),

    body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
];