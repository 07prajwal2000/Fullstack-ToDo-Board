import { Collection, ObjectId } from "mongodb";
import TodoType, {
	AddTodoListDto,
	ApiResponse,
	TodoListType,
} from "../models/todoModel";

export default class TodoServices {
	private todoListCollection: Collection<TodoListType>;
	private todosCollection: Collection<TodoType>;

	constructor(
		todoBoardCollection: Collection<TodoListType>,
		todosCollection: Collection<TodoType>
	) {
		this.todoListCollection = todoBoardCollection;
		this.todosCollection = todosCollection;
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
		};

		try {
			const response = await this.todoListCollection.updateOne(
				{ name: dto.name },
				{ $set: data },
				{ upsert: true }
			);
			response.upsertedId && (data._id = response.upsertedId);

			return {
				data: data,
				message: `successfully ${
					response.matchedCount > 0 ? "updated" : "inserted"
				}`,
				success: true,
			};
		} catch (error) {
			console.log(error);

			return {
				message: "failed to insert",
			};
		}
	}

  public async DeleteTodoList(id:string): Promise<ApiResponse<boolean>> {
    const deleteId = new ObjectId(id);

    try {
      const response = await this.todoListCollection.deleteOne({_id: deleteId});
      return {
        message: response.deletedCount > 0 ? 'Successfully deleted' : 'List not found',
        data: response.deletedCount > 0,
        success: response.deletedCount > 0,
      };
    } catch (error) {
      return {
        message: 'Failed to delete the list with id: ' + deleteId,
      }
    }
  }
}
