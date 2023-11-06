import { ObjectId } from "mongodb";
import z from "zod";

type TodoItem = {
  _id?: ObjectId;
  name: string;
  description: string;
  listId: ObjectId;
};

export type TodoItemDto = {
  name: string;
  description: string;
  listId: string;
};

export const TodoItemDtoValidator = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(100),
  listId: z.custom((data) => {
    return ObjectId.isValid(data as string);
  }),
});

export default TodoItem;