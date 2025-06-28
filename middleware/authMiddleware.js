const jwt=require("jsonwebtoken")
const auth=(req,res,next)=>{

    const authHeader=req.headers.authorization;
    if(!authHeader){
        return res.status(401).send("Authorization headrer missing")
    }
    const token =authHeader.split(" ")[1];
    if(!token){
         return res.status(401).send("Token is missing")
    }

    try {
        const decode= jwt.verify(token, process.env.JWT_SCRET);
        req.user=decode;
        next()
        
    } catch (error) {
        console.log(error)
        
    }
}

module.exports=auth