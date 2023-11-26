import { ObjectId } from "mongodb";
import z from "zod";

type TodoBoardType = {
  _id?: ObjectId;
  name: string;
  description: string;
};

export type CreateTodoBoardDto = {
  name: string;
  description: string;
};

export const CreateTodoBoardDtoValidator = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(300),
});

export default TodoBoardType;