import {body} from 'express-validator';

export const createWorkspaceValidation =[
    body("name")
    .trim()
    .notEmpty()
    .withMessage("Workspace name is required")
    .isLength({min:3,max:50})
    .withMessage("Workspace name must be between 3 and 50 characters"),

    body("description")
    .optional()
    .trim()
    .isLength({max:200})
    .isString()
    .withMessage("Description must be a string and cannot exceed 200 characters"),
];