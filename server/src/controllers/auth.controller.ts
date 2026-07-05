import {Request,Response} from 'express';
import bcrypt from 'bcrypt';

import User from '../models/User';
import generateToken from '../utils/generateToken';

export const register = async (req:Request,res:Response):Promise<void> => {
    try {
        const {name,email,password,avatarUrl} = req.body;
        if(!name || !email || !password){
            res.status(400).json({
                success:false,
                message:"Name, email and password are required"});
            return;
        }
            const existingUser = await User.findOne({
                email:email.toLowerCase(),
            });
            if(existingUser){
                res.status(409).json({
                    success:false,
                    message:"User already exists",
                });
                return;
            }

            const passwordHash = await bcrypt.hash(password,10);
            const user = await User.create({
                name,
                email:email.toLowerCase(),
                passwordHash,
                avatarUrl,
            });
            res.status(201).json({
                success:true,
                message:"User registered successfully",
                user,
            });
        } catch (error) {
            console.error("Error in register:", error);
            res.status(500).json({
                success:false,
                message:"Internal server error"
            });
        }
    };

    export const login = async (
        req:Request,
        res:Response
    ):Promise<void> =>{
      try{
        const {email,password}= req.body;
        if(!email ||!password){
            res.status(400).json({
                success:false,
                message:"Email and password are required"
            });
            return;
        }
        const user = await User.findOne(
            {email:email.toLowerCase()});
            if(!user){
                res.status(401).json({
                    success:false,
                    message:"Invalid Credentials"
                });
                return;
            }
            const isPasswordCorrect = await bcrypt.compare(
                password,
                user.passwordHash
            );
            if(!isPasswordCorrect){
                res.status(401).json({
                    success:false,
                    message:"Invalid credentials"
                });
                return;
            }
            const token = generateToken(user.id);
            res.status(200).json({
                success:true,
                message:"Login Successful",
                token,
                user
            });
      }catch(error){
        console.error("Error in Login:",error);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
      }
    };
