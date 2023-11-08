import { Collection, ObjectId } from "mongodb";
import {
	AddTodoListDto,
	ApiResponse,
	TodoListType,
} from "../models/todoListModel";
import TodoItem from "../models/todoItemModel";
import TodoBoardType from "../models/todoBoardModel";

export default class TodoListServices {
	private itemsCollection: Collection<TodoItem>;
	private todoListCollection: Collection<TodoListType>;
	private boardCollection: Collection<TodoBoardType>;

  constructor(itemsCollection: Collection<TodoItem>, todoListCollection: Collection<TodoListType>, boardCollection: Collection<TodoBoardType>) {
    this.itemsCollection = itemsCollection;
    this.todoListCollection = todoListCollection;
		this.boardCollection = boardCollection;
  }

	public async GetTodoLists(boardId: ObjectId): Promise<ApiResponse<Array<TodoListType>>> {
		if (! await this.BoardExists(boardId)) return {message: 'Board not found'};
		
		try {
			const result = await this.todoListCollection.find({boardId}).toArray();
			return { data: result, message: "", success: true };
		} catch (_) {
			return {message: 'Failed to get boards'};
		}
	}

	public async AddTodoList(
		dto: AddTodoListDto
	): Promise<ApiResponse<TodoListType>> {
		
		const data: TodoListType = {
			name: dto.name,
      description: dto.description,
			boardId: new ObjectId(dto.boardId)
		};
		if (! await this.BoardExists(data.boardId)) return {message: 'Board not found'};

		try {
			const response = await this.todoListCollection.insertOne(data);
			data._id = response.insertedId;

			return {
				data: data,
				message: `successfully inserted`,
				success: true,
			};
		} catch (_) {
			return {
				message: "failed to insert",
			};
		}
	}

	public async UpdateTodoList(
		dto: AddTodoListDto,
		id: ObjectId
	): Promise<ApiResponse<TodoListType>> {
		const data: TodoListType = {
			name: dto.name,
      description: dto.description,
			boardId: new ObjectId(dto.boardId)
		};
		if (! await this.BoardExists(data.boardId)) return {message: 'Board not found'};
		try {
			const response = await this.todoListCollection.updateOne(
				{ _id: id },
				{ $set: data },
			);
			response.upsertedId && (data._id = response.upsertedId);

			return {
				data: data,
				message: `successfully updated`,
				success: true,
			};
		} catch (_) {
			return {
				message: "failed to update",
			};
		}
	}

  public async DeleteTodoList(id:string): Promise<ApiResponse<boolean>> {
    const deleteId = new ObjectId(id);

    try {
      const response = await this.todoListCollection.deleteOne({_id: deleteId});
			await this.itemsCollection.deleteMany({listId: deleteId});

      return {
        message: response.deletedCount > 0 ? 'Successfully deleted the list and the items associated with it' : 'List not found',
        data: response.deletedCount > 0,
        success: response.deletedCount > 0,
      };
    } catch (_) {
      return {
        message: 'Failed to delete the list with id: ' + deleteId,
      }
    }
  }

	public async BoardExists(id: ObjectId): Promise<boolean> {
		try {
			const response = await this.boardCollection.findOne({ _id: id });
			return response ? true : false;
		} catch (error) {
			return false;
		}
	}
}
