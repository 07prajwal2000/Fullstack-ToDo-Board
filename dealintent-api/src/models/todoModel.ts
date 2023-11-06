import { ObjectId } from 'mongodb';
import z from 'zod';

type TodoType = {
  _id: ObjectId;
  name: string;
  listId: ObjectId;
};

export type TodoListType = {
  _id?: ObjectId;
  name: string;
};

export const AddTodoListValidator = z.object({
  name: z.string().min(1).max(100)
});

export type AddTodoListDto = {
  name: string;
};

export type ApiResponse<T> = {
  data?: T;
  message: string;
  success?: boolean;
};

export default TodoType;