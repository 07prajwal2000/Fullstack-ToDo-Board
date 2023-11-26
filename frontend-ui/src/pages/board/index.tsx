import React, { useState } from "react";
import "../../app/globals.css";
import TodoItemApi from "@/api/todoItem";
import TodoListApi from "@/api/todoList";
import { TodoItemType } from "@/types/todoItemType";
import ApiResponse, { TodoListType } from "@/types/todoListType";
import { GetServerSideProps } from "next";
import Navbar from "@/components/Navbar";
import { TodoBoardType } from "@/types/todoBoardType";
import TodoBoardApi from "@/api/todoBoard";
import KanbanBoard from "@/components/KanbanBoard";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, SheetIcon } from "lucide-react";
import Link from "next/link";

async function getData(id: string) {
	const listItems: { [id: string]: TodoItemType[] } = {};
	try {
		const data = await TodoListApi.GetTodoLists(id);
		const board = await TodoBoardApi.GetTodoBoardByID(id);
		for (let list of data.data) {
			const items = await TodoItemApi.GetTodoItemsByListId(list._id);
			listItems[list._id] = items.data;
			items.data.sort((x, y) => x.order - y.order);
		}

		return {
			todoLists: data,
			listItems,
			board: board.data
		};
	} catch (error: any) {
		return {
			todoLists: error?.response.data,
			listItems,
			board: null
		};
	}
}

export const getServerSideProps: GetServerSideProps = async (req) => {
	const id = req.query["id"];
	const data = await getData(id as string);
	
	return {
		props: { ...data, id: req.query["id"] },
	};
};

export default function Board({
	todoLists,
	listItems,
	board,
}: {
	todoLists: ApiResponse<TodoListType[]>;
	listItems: { [id: string]: TodoItemType[] };
	board: TodoBoardType;
}) {
	const [openNewTodoListDialog, setOpenNewTodoListDialog] = useState(false);
	
	if (!todoLists?.success) {
		return (
			<div>
				<Navbar />
				<div className="container mx-auto">
					<h2>Error</h2>
					<p>{todoLists.message}</p>
				</div>
			</div>
		);
	}
	return (
		<div className="container">
			<Navbar>
				<div className="flex flex-row gap-2">
					<Link href={'/'}>
						<Button size={'sm'} variant={'outline'}><SheetIcon className="w-4 mr-1" /> Back to Boards</Button>
					</Link>
					<Button onClick={() => setOpenNewTodoListDialog(p => !p)} size={'sm'} variant={'outline'} className="hover:bg-green-100 text-green-600 hover:text-green-700 transition-colors duration-200 border-green-500 active:bg-green-200" ><PlusCircleIcon className="w-4 mr-1" /> Add New List</Button>
				</div>
			</Navbar>
			<div className="container mx-auto">
				<KanbanBoard
					openNewTodoListDialog={openNewTodoListDialog}
					setOpenNewTodoListDialog={setOpenNewTodoListDialog}
					board={board}
					list={todoLists.data}
					todoItems={listItems}
				/>
			</div>
			
		</div>
	);
}
// TODO: create board,