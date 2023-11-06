import { Collection, ObjectId } from "mongodb";
import TodoItem, { TodoItemDto } from "../models/todoItemModel";
import { ApiResponse, TodoListType } from "../models/todoListModel";

export default class TodoItemServices {
  private itemsCollection: Collection<TodoItem>;
	private todoListCollection: Collection<TodoListType>;

  constructor(itemsCollection: Collection<TodoItem>, todoListCollection: Collection<TodoListType>) {
    this.itemsCollection = itemsCollection;
    this.todoListCollection = todoListCollection;
  }

  public async AddTodoItem(dto: TodoItemDto): Promise<ApiResponse<TodoItem>> {
    const listId = new ObjectId(dto.listId);
    const listExists = await this.TodoListExists(listId);

    if (!listExists) {
      return {
        message: `List with ID: ${dto.listId} doesn't exist.`
      };
    }

    try {
      const data: TodoItem = {...dto, listId};
      const response = await this.itemsCollection.insertOne(data);
      data._id = response.insertedId;
      return {
        data,
        message: 'Successfully added',
        success: true,
      };
    } catch (_) {
      return {
        message: 'Failed to insert to the database'
      };
    }
  }

  public async GetTodoItemsByListID(id: ObjectId): Promise<ApiResponse<TodoItem[]>> {
    const listExists = await this.TodoListExists(id);
    if (!listExists) {
      return {
        message: `List with ID: ${id.toString()} was not found`
      };
    }

    try {
      const data = await this.itemsCollection.find({listId: id}).toArray();
      return {
        data,
        success: true,
        message: data.length > 0 ? 'found' : 'no items',
      };
    } catch (error) {
      return {
        message: 'Failed to get data'
      };
    }
  }

  public async UpdateTodoItem(id: ObjectId, dto: TodoItemDto): Promise<ApiResponse<TodoItem>> {
    const listId = new ObjectId(dto.listId);
    const listExists = await this.TodoListExists(listId);
    if (!listExists) {
      return {
        message: `List with ID: ${id.toString()} was not found`
      };
    }
    const itemExists = await this.TodoItemExists(id);
    if (!itemExists) {
      return {
        message: `Todo Item with ID: ${id.toString()} was not found`
      };
    }
    
    try {
      const data: TodoItem = {...dto, _id: id, listId};
      await this.itemsCollection.updateOne({_id: id}, {$set: data});
      return {
        message: 'successfully updated',
        data: data,
        success: true
      };
    } catch (_) {
      return {
        message: 'Failed to update the Todo Item with ID: ' + id.toString()
      };
    }
  }

  public async DeleteTodoItem(id: ObjectId): Promise<ApiResponse<boolean>> {
    const itemExists = await this.TodoItemExists(id);
    if (!itemExists) {
      return {
        message: `Todo Item with ID: ${id.toString()} was not found`
      };
    }
    try {
      const response = await this.itemsCollection.deleteOne({_id: id});
      const deleted = response.deletedCount > 0;
      return {
        message: deleted ? 'Successfully deleted' : 'Failed to delete with ID: ' + id.toString(),
        data: deleted,
        success: deleted
      };
    } catch (_) {
      return {
        message: 'Failed to delete with ID: ' + id.toString(),
      };
    }
  }

  private async TodoItemExists(id: ObjectId): Promise<boolean> {
    try {
      const response = await this.itemsCollection.findOne({_id: id});
      
      return response ? true : false;
    } catch (_) {
      return false;
    }
  }

  private async TodoListExists(id: ObjectId): Promise<boolean> {
    try {
      const response = await this.todoListCollection.findOne({_id: id});
      
      return response ? true : false;
    } catch (_) {
      return false;
    }
  }
}