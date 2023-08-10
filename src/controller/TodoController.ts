import {NextFunction, Request, Response} from "express";
import {Err, errCode, errMsg} from "../helper/Err";
import {Todo} from "../entity/Todo"
import {myDataSource} from "../config/db";

export class TodoController {
    public static get repo() {
        return myDataSource.getRepository(Todo)
    }

    static async create(request: Request, response: Response, next: NextFunction) {
        let todo: Todo = new Todo()
        let {todoName} = request.body
        try {
            todo.todoName = todoName
            todo = await TodoController.repo.save(todo)
        } catch (e) {
            return response.status(400).send(new Err(errCode.E400, errMsg.Fail, e))
        }
        return response.status(200).send(new Err(errCode.E200, errMsg.OK, todo))
    }

    static async delete(request: Request, response: Response, next: NextFunction) {
        try {
            await TodoController.repo.clear()
        } catch (e) {
            return response.status(400).send(new Err(errCode.E400, errMsg.Fail, e))
        }
        return response.status(200).send(new Err(errCode.E200, errMsg.OK, Todo))
    }

    static async update(request: Request, response: Response, next: NextFunction) {
        let todo: Todo = undefined
        try {
            let {isChecked} = request.body
            let id = request.params?.id
            todo = await TodoController.repo.findOneOrFail({where: {id: +id}})
            todo.isChecked = isChecked
            await TodoController.repo.save(todo)
        } catch (e) {
            return response.status(400).send(new Err(errCode.E400, errMsg.Fail, e))
        }
        return response.status(200).send(new Err(errCode.E200, errMsg.OK, Todo))
    }

    static async getTodo(request: Request, response: Response, next: NextFunction) {
        const {done} = request.query
        try {
            let query = myDataSource.getRepository(Todo).createQueryBuilder('todo')

            if (done === 'true') {
                query = query
                    .take(10)
                    .orderBy('todo.checkedTime', 'DESC')
                    .where('todo.isChecked = :isChecked', {isChecked: true})
                const todos = await query.getMany()
                const idLetterSort = todos.sort((itemA, itemB) => itemA.todoName.localeCompare(itemB.todoName, 'en', {sensitivity: 'base'}))
                response.json(idLetterSort)
            } else if (done === 'false') {
                query = query
                    .orderBy({
                        "todo.todoName": "ASC"
                    })
                    .where('todo.isChecked = :isChecked', {isChecked: false})
                const letterTodos = await query.getMany();
                response.json(letterTodos);
            } else {
                query = query
                    .orderBy({
                        "todo.todoName": "ASC"
                    })
                const todos = await query.getMany()
                response.json(todos)
            }
        } catch (e) {
            return response.status(400).json({error: "Failed to fetch todos", message: e.message})
        }
    }

    static async getByName(request: Request, response: Response, next: NextFunction) {
        const {keyword, done} = request.query
        try {
            let query = myDataSource.getRepository(Todo).createQueryBuilder('todo')

            if (done === 'true') {
                query = query.where('todo.isChecked = :isChecked', {isChecked: true})
            } else if (done === 'false') {
                query = query.where('todo.isChecked = :isChecked', {isChecked: false})
            }

            if (keyword) {
                query = query.andWhere('todo.todoName LIKE :keyword', {keyword: `%${keyword}%`})
            }
            const todos = await query.take(10).orderBy('todo.checkedTime', 'DESC').getMany()
            const idLetterSort = todos.sort((itemA, itemB) => itemA.todoName.localeCompare(itemB.todoName, 'en', {sensitivity: 'base'}))
            response.json(idLetterSort)
        } catch (e) {
            return response.status(400).json({error: "Failed to fetch todos", message: e.message});
        }
    }
}