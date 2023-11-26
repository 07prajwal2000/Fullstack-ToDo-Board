import ApiResponse, { TodoListType, UpsertTodoListRequestType } from "@/types/todoListType";
import { DeleteFetcher, GetFetcher, PostFetcher, PutFetcher } from "./fetcher";

export default class TodoListApi {
	private static endpointUrl = "/todos/list";
  public static TODO_LIST_SWR_KEY = this.endpointUrl;
  
	public static async GetTodoLists(boardId: string): Promise<ApiResponse<TodoListType[]>> {
		const response = await GetFetcher(this.endpointUrl + "?boardid=" + boardId);
		return response.data;
	}

	public static async InsertTodoList(value: UpsertTodoListRequestType): Promise<ApiResponse<TodoListType>> {
    const response = await PostFetcher(this.endpointUrl, value);
    return response.data;
  }

	public static async UpdateTodoList(value: UpsertTodoListRequestType, listId: string): Promise<ApiResponse<TodoListType>> {
    const response = await PutFetcher(this.endpointUrl + '?id=' + listId, value);
    return response.data;
  }

  public static async DeleteTodoList(id: string): Promise<ApiResponse<boolean>> {
    const deleteUrl = `${this.endpointUrl}?id=${id}`;
    const response = await DeleteFetcher(deleteUrl);
		return response.data;
  }
}