import { ObjectId } from 'mongodb';
import z from 'zod';

export type TodoListType = {
  _id?: ObjectId;
  name: string;
  description: string;
};

export const AddTodoListValidator = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(2).max(2000),
});

export type AddTodoListDto = {
  name: string;
  description: string;
};

export type ApiResponse<T> = {
  data?: T;
  message: string;
  success?: boolean;
};