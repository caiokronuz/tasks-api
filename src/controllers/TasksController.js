import db from '../database/connection.js';

export default class TasksController{

    async create(req, res){
        const {title} = req.body;

        if(!title){
            return res.status(400).send({error: "Task is not informed on request"});
        }

        const database = await db.transaction();

        try{
            const insertedTask = await database('tasks').insert({
                title,
                user_id: req.userId,
            });

            const taskId = insertedTask[0];

            await database.commit();

            return res.status(200).send({success: taskId.toString()});
        }catch(err){
            console.log(err);
            await database.rollback();
            return res.status(400).send({error: "Unexpeted error while creating your task, please try again soon"})
        }
    }

    async index(req, res){
        const user_id = req.userId;

        try{
            const tasks = await db('tasks')
                .whereRaw('tasks.user_id = ?', [user_id])
                .join('users', 'tasks.user_id', '=', 'users.id')
                .select(['tasks.*', 'users.name'])
    
            return res.send(tasks);
        }catch(err){
            return res.status(400).send({error: "A error ocurred"})
        }   
    }

    async indexTask(req, res){
        const id = req.params.id;
        const user_id = req.userId;

        try{
            const task = await db('tasks')
                .whereRaw('tasks.id = ? and tasks.user_id = ?', [id, user_id])

            if(task.length == 0){
                return res.status(400).send({error: "No task found"})
            }

            return res.send({task})
        }catch(err){
            return res.status(400).send({error: "A error ocurred"})
        }
    }

    async update(req, res){
        const {done} = req.body;
        const id = req.params.id;
        const user_id = req.userId;

        if(!id || !done){
            return res.status(400).send({error: "Error, verify your data and try again!"})
        }

        if(done != 0 && done != 1){
            return res.status(400).send({error: "Error, invalid data"})
        }

        try{
            const updatedTask = await db('tasks')
                .where({id: id, user_id: user_id})
                .update({
                    done
                })

            if(updatedTask == 0){
                return res.status(400).send({error: "No task found"})
            }

            return res.status(200).send({updatedTask});
              
        }catch(err){
            console.log(err);
            return res.status(400).send({error: "A error occured on update, try again soon"});
        }
    }

    async delete(req, res){
        const id = req.params.id;
        const user_id = req.userId;

        if(!id){
            return res.status(400).send({error: "Error, verify your data and try again!"});
        }

        try{
            const del = await db('tasks').whereRaw("id = ? and user_id = ?", [id, user_id]).del();

            if(del == 0){
                return res.status(400).send({error: "No task found"})
            }

            return res.status(200).send();
        }catch(err){
            return res.status(400).send({error: "Error on deleting your task, please try again"})
        }
        
    }
}