import { Collection, ObjectId } from "mongodb";
import {
	AddTodoListDto,
	ApiResponse,
	TodoListType,
} from "../models/todoListModel";
import TodoItem from "../models/todoItemModel";

export default class TodoListServices {
	private itemsCollection: Collection<TodoItem>;
	private todoListCollection: Collection<TodoListType>;

  constructor(itemsCollection: Collection<TodoItem>, todoListCollection: Collection<TodoListType>) {
    this.itemsCollection = itemsCollection;
    this.todoListCollection = todoListCollection;
  }

	public async GetTodoLists(): Promise<ApiResponse<Array<TodoListType>>> {
		const result = await this.todoListCollection.find().toArray();
		return { data: result, message: "", success: true };
	}

	public async AddTodoList(
		dto: AddTodoListDto
	): Promise<ApiResponse<TodoListType>> {
		const data: TodoListType = {
			name: dto.name,
      description: dto.description
		};

		try {
			const response = await this.todoListCollection.updateOne(
				{ name: dto.name },
				{ $set: data }
			);
			response.upsertedId && (data._id = response.upsertedId);

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
      description: dto.description
		};

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
}
