import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import {PrismaClient} from "@prisma/client"

dotenv.config()
const prisma = new PrismaClient()
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const authMiddleware= async (req,res,next)=>{
    const authHeader=req.headers["authorization"]
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(403),json({message:"No token provided"})
    }
    const token =authHeader.split(" ")[1]

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "Secret")
        const user=await prisma.user.findUnique({
            where:{
                id: decoded.id
            }
        })

        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        req.user = decoded;
        next()
    }catch (e){
        console.error("JWT verification error: ", e)
        res.status(403).json({message:"Invalid token"})
    }
}

export function isAdmin(req, res, next) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}
