import { TodoItemType } from "./todoItemType";

export type TodoListType = {
  _id: string;
  name: string;
  description: string;
  boardId: string;
};

export type UpsertTodoListRequestType = {
  name: string;
  description: string;
  boardId: string;
}

export type ListColumnType = {
  [id: string]: {
    name: string;
    description: string;
    boardId: string;
    items: TodoItemType[];
  }
};

type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
}

export default ApiResponse;