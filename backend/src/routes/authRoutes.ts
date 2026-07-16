import { Router } from "express";
import {Admin} from "../models/Admin.js"
import { issueSessionToken, verifyGoogleToken } from "../auth.js";

export const authRoutes=Router();

authRoutes.post("/google",async(req,res)=>{
    const {idToken}=req.body ?? {};
    if(!idToken){
        res.status(400).json({error:"idtoken is required"});
        return;
    }
    try{
        const profile=await verifyGoogleToken(idToken);
        const admin= await Admin.findOneAndUpdate(
            {googleId: profile.googleId},
            {$set:{email:profile.email,name:profile.name, picture: profile.picture}},
            {upsert:true, new: true}
        );

        const token= issueSessionToken({adminId:admin?._id.toString(), email: admin.email});
        res.json({
            token,
            admin:{
                id:admin._id,
                name:admin.name,
                email:admin?.email,
                picture:admin.picture
            },
        });

    }catch (err){
        console.error("google auth failed ",err);
        res.status(401).json({error:"google authentication failed"})
    }
});