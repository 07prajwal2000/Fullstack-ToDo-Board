import ApiResponse from "@/types/todoListType";
import { DeleteFetcher, GetFetcher, PostFetcher, PutFetcher } from "./fetcher";
import { TodoItemType } from "@/types/todoItemType";
import { TodoItemRequest } from "@/types/todoItemType";

export default class TodoItemApi {
  private static endpointUrl = "/todos/item";
  public static TODO_ITEMS_SWR_KEY = this.endpointUrl;

  public static async GetTodoItemsByListId(listId:string): Promise<ApiResponse<TodoItemType[]>> {
    const url = `${this.endpointUrl}?listid=${listId}`;
    const response = await GetFetcher(url);
    return response.data;
  }

  public static async AddTodoItem(value: TodoItemRequest): Promise<ApiResponse<TodoItemType>> {
    const url = `${this.endpointUrl}`;
    const response = await PostFetcher(url, value);
    return response.data;
  }

  public static async UpdateTodoItem(id:string, value: TodoItemRequest): Promise<ApiResponse<TodoItemType>> {
    const url = `${this.endpointUrl}?id=${id}`;
    const response = await PutFetcher(url, value);
    return response.data;
  }
  
  public static async DeleteTodoItem(listId:string): Promise<ApiResponse<boolean>> {
    const url = `${this.endpointUrl}?id=${listId}`;
    const response = await DeleteFetcher(url);
    return response.data;
  }
}