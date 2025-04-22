import { Request, Response } from "express";
import { createUser } from "./service";



export const create = async (req: Request, res: Response) => {
    try {
        const user = await createUser(req.body);
        res.status(200).json(user);
    } catch (error: any) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Error creating user", details: error.message });
    }
}