import jwt from "jsonwebtoken";

export const verifyAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).send({error: "No token provided"});
    }

    const parts = authHeader.split(' ');

    if(!parts.length === 2){
        return res.status(401).send({error: "Token error"});
    }

    const [scheme, token] = parts;

    if(scheme != "Bearer"){
        return res.status(401).send({error: "Token malformatted"});
    }

    jwt.verify(token, 'apitest', (err, decoded) => {
        if(err){
            return res.status(401).send({error: "Token invalid"});
        }

        req.userId = decoded.id;
        return next();
    });
};