import { Express, Request, Response } from "express";
import { MongoClient, Collection, ObjectId } from "mongodb";
import { GetEnv } from "../utils/env";
import TodoListServices from "../services/todoListServices";
import {
	AddTodoListDto,
	AddTodoListValidator,
	ApiResponse,
	TodoListType,
} from "../models/todoListModel";
import TodoItem, {
	TodoItemDto,
	TodoItemDtoValidator,
} from "../models/todoItemModel";
import TodoItemServices from "../services/todoItemServices";

let todoListServices: TodoListServices;
let todoItemServices: TodoItemServices;

export default function MapTodosController(app: Express, client: MongoClient) {
	const mongoClient = client;
	const database = mongoClient.db(GetEnv("MONGO_DBNAME"));

	const todoBoardCollection =
		database.collection<TodoListType>("TODO_BOARDS");
	const todosCollection = database.collection<TodoItem>("TODOS");

	todoListServices = new TodoListServices(
		todosCollection,
		todoBoardCollection
	);
	todoItemServices = new TodoItemServices(
		todosCollection,
		todoBoardCollection
	);

	app.get("/todos/list", getTodoLists);
	app.post("/todos/list", addTodoList);
	app.put("/todos/list", updateTodoList); // ?id=
	app.delete("/todos/list", deleteTodoList); // ?id=

	app.get("/todos/item", getTodoItemsByListID); // ?listid=
	app.post("/todos/item", addTodoItem); //
	app.put("/todos/item", updateTodoItemsByListID); // ?id=
	app.delete("/todos/item", DeleteTodoItem); // ?id=
}

async function getTodoLists(request: Request, response: Response) {
	const data = await todoListServices.GetTodoLists();

	response.json(data);
}

async function addTodoList(request: Request, response: Response) {
	const dto = request.body as AddTodoListDto;

	if (!dto || !AddTodoListValidator.safeParse(dto).success) {
		const errResponse: ApiResponse<any> = {
			message: "Validation error",
		};
		response.status(400).json(errResponse);
		return;
	}
	const data = await todoListServices.AddTodoList(dto);
	if (!data.success) {
		response.status(400).json(data);
		return;
	}
	response.json(data);
}

async function updateTodoList(request: Request, response: Response) {
	const dto = request.body as AddTodoListDto;
	const id = request.query["id"]?.toString() || "";

	if (!ObjectId.isValid(id)) {
		const resp: ApiResponse<boolean> = {
			message: "Invalid ID: " + id,
		};
		response.status(400).json(resp);
		return;
	}

	if (!dto || !AddTodoListValidator.safeParse(dto).success) {
		const errResponse: ApiResponse<any> = {
			message: "Validation error",
		};
		response.status(400).json(errResponse);
		return;
	}
	const data = await todoListServices.UpdateTodoList(dto, new ObjectId(id));
	response.status(data.success ? 200 : 400).json(data);
}

async function deleteTodoList(request: Request, response: Response) {
	const id = request.query["id"]?.toString() || "";

	if (!ObjectId.isValid(id)) {
		const resp: ApiResponse<boolean> = {
			message: "Invalid ID: " + id,
		};
		response.status(400).json(resp);
		return;
	}

	const resp = await todoListServices.DeleteTodoList(id);
	response.status(resp.success ? 200 : 400).json(resp);
}

// TODO Items route handlers
async function addTodoItem(request: Request, response: Response) {
	const dto = request.body as TodoItemDto;
	let resp: ApiResponse<TodoItem> = {
		message: "",
	};

	if (!TodoItemDtoValidator.safeParse(dto).success) {
		resp.message = "Validation error";
		response.status(400).json(resp);
		return;
	}

	const data = await todoItemServices.AddTodoItem(dto);
	response.status(data.success ? 200 : 400).json(data);
}

async function getTodoItemsByListID(request: Request, response: Response) {
	const idAsStr = request.query["listid"]?.toString() || "";

	if (!ObjectId.isValid(idAsStr)) {
		const resp: ApiResponse<boolean> = {
			message: "Invalid List ID: " + idAsStr,
		};
		response.status(400).json(resp);
		return;
	}

	const listId = new ObjectId(idAsStr);
	const data = await todoItemServices.GetTodoItemsByListID(listId);
	response.status(data.success ? 200 : 400).json(data);
}

async function updateTodoItemsByListID(request: Request, response: Response) {
	const idAsStr = request.query["id"]?.toString() || "";
	if (!ObjectId.isValid(idAsStr)) {
		const resp = {
			message: "Invalid ID: " + idAsStr,
		};
		response.status(400).json(resp);
		return;
	}
	const dto = request.body as TodoItemDto;
	if (!TodoItemDtoValidator.safeParse(dto).success) {
		const resp = {
			message: "Validation error",
		};
		response.status(400).json(resp);
		return;
	}

	const id = new ObjectId(idAsStr);
	const data = await todoItemServices.UpdateTodoItem(id, dto);
	response.status(data.success ? 200 : 400).json(data);
}

async function DeleteTodoItem(request: Request, response: Response) {
	const idAsStr = request.query["id"]?.toString() || "";
	if (!ObjectId.isValid(idAsStr)) {
		const resp = {
			message: "Invalid ID: " + idAsStr,
		};
		response.status(400).json(resp);
		return;
	}
	const id = new ObjectId(idAsStr);
	const data = await todoItemServices.DeleteTodoItem(id);
	response.status(data.success ? 200 : 400).json(data);
}
