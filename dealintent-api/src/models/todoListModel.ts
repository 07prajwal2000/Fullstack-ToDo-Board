import { ObjectId } from 'mongodb';
import z, { string } from 'zod';

export type TodoListType = {
  _id?: ObjectId;
  name: string;
  boardId: ObjectId;
  description: string;
};

export const AddTodoListValidator = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(2).max(2000),
  boardId: z.custom((s: any) => {
    return ObjectId.isValid(s);
  })
});

export type AddTodoListDto = {
  name: string;
  boardId: string;
  description: string;
};

export type ApiResponse<T> = {
  data?: T;
  message: string;
  success?: boolean;
};