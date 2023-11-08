import { Collection, ObjectId } from "mongodb";
import TodoBoardType, {
	CreateTodoBoardDto as TodoBoardDto,
} from "../models/todoBoardModel";
import { ApiResponse } from "../models/todoListModel";
import TodoListServices from "./todoListServices";

export default class TodoBoardServices {
	private collection: Collection<TodoBoardType>;
	private todoListServices: TodoListServices;

	private defaultListItems = [
		{
			name: 'ToDo',
			description: 'The TODO Items'
		},
		{
			name: 'In Progress',
			description: 'The In-Progress Items'
		},
		{
			name: 'Completed',
			description: 'The Completed Items'
		},
	];
	
	constructor(
		collection: Collection<TodoBoardType>,
		todoListServices: TodoListServices
	) {
		this.collection = collection;
		this.todoListServices = todoListServices;
	}

	public async GetBoardById(id: ObjectId): Promise<ApiResponse<TodoBoardType>> {
		try {
			const response = await this.collection.findOne({_id: id});
			return {
				// @ts-ignore
				data: response,
				message: "",
				success: true,
			};
		} catch (_) {
			return {
				message: "Failed to get the data",
			};
		}
	}

	public async GetBoards(): Promise<ApiResponse<TodoBoardType[]>> {
		try {
			const response = await this.collection.find().toArray();
			return {
				// @ts-ignore
				data: response,
				message: "",
				success: true,
			};
		} catch (_) {
			return {
				message: "Failed to get the data",
			};
		}
	}

	public async CreateTodoBoards(
		dto: TodoBoardDto
	): Promise<ApiResponse<TodoBoardType>> {
		try {
			const data: TodoBoardType = { ...dto };
			const response = await this.collection.insertOne(data);
			const proms = [];
			for (let list of this.defaultListItems) {
				proms.push(this.todoListServices.AddTodoList({
					...list,
					boardId: response.insertedId.toString()
				}))
			}
			data._id = response.insertedId;
			await Promise.all(proms);
			return {
				data,
				message: "Successfully added",
				success: true,
			};
		} catch (_) {
			return {
				message: "Failed to create",
			};
		}
	}

	public async UpdateTodoBoards(
		id: ObjectId,
		dto: TodoBoardDto
	): Promise<ApiResponse<TodoBoardType>> {
		if (!(await this.BoardExists(id)))
			return { message: "Todo board not found" };

		try {
			const data: TodoBoardType = { ...dto, _id: id };
			const response = await this.collection.updateOne(
				{ _id: id },
				{ $set: data }
			);
			return {
				message: "Successfully updated.",
				success: true,
				data,
			};
		} catch (error) {
			return {
				message: "Failed to update",
			};
		}
	}

	public async DeleteBoard(boardId: ObjectId): Promise<ApiResponse<boolean>> {
		const lists = await this.todoListServices.GetTodoLists(boardId);
		const proms: Promise<any>[] = [];

    if (lists.data) {
      for (let l of lists.data) {
        const p = this.todoListServices.DeleteTodoList(l._id!.toString())
        proms.push(p);
      }
    }
    proms.push(this.collection.deleteOne({_id: boardId}));
		try {
      await Promise.all(proms);
      return {
        message: 'Successfully deleted',
        data: true,
        success: true
      };
		} catch (_) {
      return {
        message: 'Failed to delete the board'
      };
    }
	}

	public async BoardExists(id: ObjectId): Promise<boolean> {
		try {
			const response = await this.collection.findOne({ _id: id });
			return response ? true : false;
		} catch (error) {
			return false;
		}
	}
}
