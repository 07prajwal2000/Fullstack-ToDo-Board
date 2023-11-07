export type TodoItemType = {
  _id: string;
  name: string;
  description: string;
  order: number;
  listId: string;
};
export type TodoItemRequest = {
  name: string;
  description: string;
  order: number;
  listId: string;
};