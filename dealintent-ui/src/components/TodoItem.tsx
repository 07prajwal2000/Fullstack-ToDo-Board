import { TodoItemType } from "@/types/todoItemType";
import React from "react";
import TodoItemDialog from "./TodoItemDialog";
import { Button } from "./ui/button";
import { TrashIcon } from "lucide-react";

interface TodoItemTypes extends React.HtmlHTMLAttributes<HTMLDivElement> {
	data: TodoItemType;
	isDragging: boolean;
	onEditComplete: (value: TodoItemType, index: number) => void;
	onDeleteClicked: (id: string, listId: string) => void;
	customRef: any;
	index: number;
}

const TodoItem: React.FC<TodoItemTypes> = ({
	data,
	isDragging,
	onEditComplete,
	customRef,
	onDeleteClicked,
	index,
	...props
}) => {
	function onDelete() {
		onDeleteClicked(data._id, data.listId);
	}

	function onEditClicked(name: string, desc: string) {
		if (!name && !desc) return;

		onEditComplete(
			{
				...data,
				name: name,
				description: desc,
			},
			index
		);
	}

	return (
		<div
			className={`p-2 w-[220px] min-h-[80px] rounded-sm border-2 border-slate-300 shadow-lg ${
				isDragging ? "bg-slate-200" : "bg-white"
			}`}
			ref={customRef}
			{...props}
		>
			<div className="flex flex-row justify-between items-center mb-2">
				<h5 className="font-semibold">{data.name}</h5>
				<div>
					<Button size={'sm'} onClick={onDelete} variant={'ghost'} className="text-red-600"><TrashIcon className="w-4" /> </Button>
					<TodoItemDialog
						showButtons
						onDoneClicked={onEditClicked}
						description={data.description}
						name={data.name}
						editing
					/>
				</div>
			</div>
			<p className="text-sm">{data.description}</p>
		</div>
	);
};

export default TodoItem;
