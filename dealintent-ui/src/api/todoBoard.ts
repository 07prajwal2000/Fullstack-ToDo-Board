import ApiResponse from "@/types/todoListType";
import { DeleteFetcher, GetFetcher, PostFetcher, PutFetcher } from "./fetcher";
import { TodoBoardRequest, TodoBoardType } from "@/types/todoBoardType";

export default class TodoBoardApi {
	private static endpointUrl = "/todos/board";
  public static TODO_LIST_SWR_KEY = this.endpointUrl;
  
	public static async GetTodoBoard(): Promise<ApiResponse<TodoBoardType[]>> {
		const response = await GetFetcher(this.endpointUrl);
		return response.data;
	}
  
	public static async GetTodoBoardByID(id: string): Promise<ApiResponse<TodoBoardType>> {
		const response = await GetFetcher(this.endpointUrl + '/' + id);
		return response.data;
	}

	public static async InsertTodoBoard(value: TodoBoardRequest): Promise<ApiResponse<TodoBoardType>> {
    const response = await PostFetcher(this.endpointUrl, value);
    return response.data;
  }

	public static async UpdateTodoBoard(value: TodoBoardRequest, listId: string): Promise<ApiResponse<TodoBoardType>> {
    const response = await PutFetcher(this.endpointUrl + '?boardid=' + listId, value);
    return response.data;
  }

  public static async DeleteTodoBoard(id: string): Promise<ApiResponse<boolean>> {
    const deleteUrl = `${this.endpointUrl}?boardid=${id}`;
    const response = await DeleteFetcher(deleteUrl);
		return response.data;
  }
}