import {body} from "express-validator";

export const registerValidaton=[
    body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

    body("email")
    .isEmail()
    .withMessage("Valid Email is required"),

    body("password")
    .isLength({min:6})
    .withMessage("Password must be at least 6 characters long")
];

export const loginValidation=[
    body("email")
    .isEmail()
    .withMessage("Valid Email is required"),

    body("password")
    .notEmpty()
    .withMessage("Password is required")
];