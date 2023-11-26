"use client";

import { TodoBoardType } from "@/types/todoBoardType";
import React, { useState } from "react";
import BoardItem from "./BoardItem";
import TodoBoardApi from "@/api/todoBoard";

const TodoBoardGrid = ({ data }: { data: TodoBoardType[] }) => {
	const [boardItems, setBoardItems] = useState(data);

	async function onDeleteClicked(boardId: string) {
		try {
			const resp = await TodoBoardApi.DeleteTodoBoard(boardId);
      if (!resp.success) {
        return;
      }
			setBoardItems((p) => {
				const temp = p.filter((x) => x._id != boardId);
				return temp;
			});
		} catch (e: any) {
      alert(e?.response?.data?.message || "Server error");
    }
	}

	async function onEdit(id: string, name: string, description: string) {
		try {
			await TodoBoardApi.UpdateTodoBoard({ name, description }, id);

			setBoardItems((p) => {
				let index = -1;
				const temp = [...p];
				p.forEach((x, idx) => {
					if (x._id == id) {
						index = idx;
						return;
					}
				});
				if (index == -1) return p;
				temp[index] = { _id: id, name, description };

				return temp;
			});
		} catch (e: any) {
			alert(e?.response?.data?.message || "Server error");
		}
	}

	return (
		<div className="flex flex-row gap-4">
			{boardItems.map((x) => (
				<BoardItem
					onEdit={onEdit}
					onDeleteClicked={onDeleteClicked}
					{...x}
				/>
			))}
		</div>
	);
};

export default TodoBoardGrid;
