import TodoListApi from "@/api/todoList";
import KanbanBoard from "@/components/KanbanBoard";
import TodoItemApi from "@/api/todoItem";
import { TodoItemType } from "@/types/todoItemType";

async function getData() {
  const { data } = await TodoListApi.GetTodoLists();
  const listItems: {[id: string]: TodoItemType[]} = {};

  for (let list of data) {
    const items = await TodoItemApi.GetTodoItemsByListId(list._id);
    listItems[list._id] = items.data;
    items.data.sort((x, y) => (x.order - y.order));
  }
  
  return {
    todoLists: data,
    listItems
  }
}
export default async function Home() {
  const data = await getData();
  
	return (
		<div>
			<KanbanBoard list={data.todoLists} todoItems={data.listItems} />
		</div>
	);
}
