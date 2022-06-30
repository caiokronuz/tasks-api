import db from '../database/connection.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

function generateToken(id){
    return jwt.sign({id}, 'apitest', {
        expiresIn: 86400,
    })
}

async function verifyUserEmail(email){
    const user = await db('users').whereRaw('users.email = ?', [email]);
    return user.length;
}

export default class UserController{

    //Register
    async create(req, res){

        let {name, email, password} = req.body

        if(!name || !email || !password){
            return res.status(400).send({error: "Invalid data, verify your informations and try again"})
        }

        const verifyEmail = await verifyUserEmail(email);
        if(verifyEmail == 1){
            return res.status(400).send({error: "User already exists"});
        }

        password = await bcrypt.hash(password, 10)

        const database = await db.transaction(); //Abre conexão com o banco

        try{

            const insertedUserId = await database('users').insert({
                name,
                email,
                password
            })

            const user_id = insertedUserId[0];

            await database.commit();

            return res.status(200).send({success: user_id.toString()});

        }catch(err){
            console.log(err);
            await database.rollback();
            return res.status(400).send({error: "Unexpeted error while creating your account, please try again soon"})
        }
    }

    //Login
    async login(req, res){
        let {email, password} = req.body;

        if(!email || !password){
            return res.status(400).send({error: "Invalid data, verify your informations and try again"})
        }

        const verifyEmail = await verifyUserEmail(email);
        if(verifyEmail == 0){
            return res.status(400).send({error: "Email or password invalid"});
        }


        try{
            const user = await db('users').whereRaw('users.email = ?', [email]);

            if(!await bcrypt.compare(password, user[0].password)){
                return res.status(400).send({error: "Email or password invalid"})
            }

            user[0].password = undefined;

            //Criar o jwt
            const token = generateToken(user[0].id);

            return res.send({user, token});

        }catch(err){
            console.log(err);
            return res.status(400).send({error: "Login error, please try again"});
        }
    }

    //Update password
    async update(req, res){
        let {password, newPassword} = req.body;
        const id = req.userId;

        if(!password || !newPassword){
            return res.status(400).send({error: "Invalid data"});
        }

        if(password == newPassword){
            return res.status(400).send({error: "The new password cannot be the same as the previous one"})
        }

        newPassword = await bcrypt.hash(newPassword, 10)

        try{
            const user = await db('users').where({id});

            if(!await bcrypt.compare(password, user[0].password)){
                return res.status(400).send({error: "Invalid password"})
            }

            const updateUserPassword = await db('users').where({id}).update({
                password: newPassword,
            })

            return res.status(200).send({updateUserPassword});
        }catch(err){
            console.log(err);
            return res.status(400).send({error: "Error on updating your password, please try again"});
        }
    }
}