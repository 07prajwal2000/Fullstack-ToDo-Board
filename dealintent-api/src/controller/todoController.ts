import { Express, Request, Response } from "express";
import { MongoClient, Collection, ObjectId } from "mongodb";
import { GetEnv } from "../utils/env";
import TodoServices from "../services/todoServices";
import TodoType, { AddTodoListDto, AddTodoListValidator, ApiResponse, TodoListType } from "../models/todoModel";

let services: TodoServices;

export default function MapTodosController(app: Express, client: MongoClient) {
  const mongoClient = client;
  const database = mongoClient.db(GetEnv('MONGO_DBNAME'));

  const todoBoardCollection = database.collection<TodoListType>('TODO_BOARDS');
  const todosCollection = database.collection<TodoType>("TODOS");
  
  services = new TodoServices(todoBoardCollection, todosCollection);
  
	app.get("/todos/list", getTodos);
	app.post("/todos/list", addTodoList);
	app.delete("/todos/list", deleteTodoList);
}

async function getTodos(request: Request, response: Response) {
  const data = await services.GetTodoLists();
  
  response.json(data);
}

async function addTodoList(request: Request, response: Response) {
  const dto = request.body as AddTodoListDto;
  
  if (!dto || !AddTodoListValidator.safeParse(dto).success) {
    const errResponse: ApiResponse<any> = {
      message: 'Validation error'
    };
    response.status(400);
    response.json(errResponse);
    return;
  }
  const data = await services.AddTodoList(dto);
  if (!data.success) {
    response.status(400);
    response.json(data);
    return;
  }
  response.json(data);
}

async function deleteTodoList(request:Request, response: Response) {
  const id = request.query['id']?.toString() || '';
  
  if (!ObjectId.isValid(id)) {
    const resp: ApiResponse<boolean> = {
      message: 'Invalid ID: ' + id,
    };
    response.status(400);
    response.json(resp);
    return;
  }

  const resp = await services.DeleteTodoList(id);
  response.status(resp.success ? 200 : 400);
  response.json(resp);
}