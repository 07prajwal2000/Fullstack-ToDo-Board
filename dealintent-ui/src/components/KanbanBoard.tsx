"use client";

import React, { useMemo, useState } from "react";
import {
	DragDropContext,
	Draggable,
	DropResult,
	Droppable,
	resetServerContext,
} from "react-beautiful-dnd";
import TodoItem from "./TodoItem";
import { TodoItemType } from "@/types/todoItemType";
import { Button } from "./ui/button";
import { PlusCircleIcon, XCircleIcon, PencilIcon } from "lucide-react";
import { ListColumnType, TodoListType } from "@/types/todoListType";
import TodoListApi from "@/api/todoList";
import TodoItemApi from "@/api/todoItem";
import TodoItemDialog from "./TodoItemDialog";

type KanbanBoardType = {
	list: TodoListType[];
	todoItems: { [id: string]: TodoItemType[] };
};

const KanbanBoard: React.FC<KanbanBoardType> = ({ list, todoItems }) => {
	const testcolumns = useMemo<ListColumnType>(() => {
		const data: ListColumnType = {};
		list.forEach((x) => {
			data[x._id] = {
				...x,
				items: todoItems[x._id],
			};
		});
		return data;
	}, []);

	const [newTodoListDialogOpened, setNewTodoListDialogOpened] =
		useState(false);
    const [newTodoDialogOpened, setNewTodoDialogOpened] = useState(false);
    const [newTodoListId, setNewTodoListId] = useState("");
    
    const [editTodoListDialogOpened, setEditTodoListDialogOpened] =
    useState(false);
    const [editTodoListId, setEditTodoListId] = useState("");

	resetServerContext();

	const [columns, setColumns] = useState(testcolumns);

	async function onDragEnd(result: DropResult) {
		if (!result.destination) return;
		const { source, destination } = result;
		const promises: Promise<any>[] = [];

		if (source.droppableId !== destination.droppableId) {
			const sourceColumn = columns[source.droppableId];
			const destColumn = columns[destination.droppableId];
			const sourceItems = [...sourceColumn.items];
			const destItems = [...destColumn.items];
			const [removed] = sourceItems.splice(source.index, 1);
			destItems.splice(destination.index, 0, removed);
			removed.listId = destination.droppableId;

			for (let i = destination.index; i < destItems.length; i++) {
				destItems[i].order = i;
				// update all the items using Promise.all
				const prom = TodoItemApi.UpdateTodoItem(
					destItems[i]._id,
					destItems[i]
				);
				promises.push(prom);
			}

			setColumns({
				...columns,
				[source.droppableId]: {
					...sourceColumn,
					items: sourceItems,
				},
				[destination.droppableId]: {
					...destColumn,
					items: destItems,
				},
			});

			try {
				await Promise.all(promises);
			} catch (error) {
				console.log(error);
				alert("Bulk update error");
			}
		} else {
			const column = columns[source.droppableId];
			const copiedItems = [...column.items];
			const [removed] = copiedItems.splice(source.index, 1);
			copiedItems.splice(destination.index, 0, removed);
			removed.listId = source.droppableId;
			const from = Math.min(source.index, destination.index);
			const to = Math.max(source.index, destination.index);

			for (let i = from; i <= to; i++) {
				copiedItems[i].order = i;
				// update all the items using Promise.all
				const prom = TodoItemApi.UpdateTodoItem(
					copiedItems[i]._id,
					copiedItems[i]
				);
				promises.push(prom);
			}
			setColumns({
				...columns,
				[source.droppableId]: {
					...column,
					items: copiedItems,
				},
			});
			try {
				await Promise.all(promises);
			} catch (error) {
				console.log(error);
				alert("Bulk update error");
			}
		}
	}

	async function createTodoItem(
		columnId: string,
		name: string,
		description: string
	) {
		if (!name || !description) return;
		const newItem: TodoItemType = {
			_id: "",
			name,
			description,
			listId: columnId,
			order: Number.MAX_SAFE_INTEGER,
		};
		let canPush = false;
		try {
			const response = await TodoItemApi.AddTodoItem({
				name: newItem.name,
				description: newItem.description,
				listId: newItem.listId,
				order: newItem.order,
			});
			newItem._id = response.data._id;
			canPush = true;
		} catch (error: any) {
			error?.response?.data?.message && console.log(error);
			alert(
				error?.response?.data?.message ||
					"Server error. See console for error"
			);
		}

		canPush &&
			setColumns((p) => {
				const col = p[columnId];
				col.items.push(newItem);
				return { ...p };
			});
	}

	async function deleteColumn(listId: string) {
		if (
			!confirm(
				"Are you sure want to delete the list with the items associated with it?"
			)
		)
			return;

		let canDelete = false;
		try {
			const response = await TodoListApi.DeleteTodoList(listId);
			canDelete = true;
		} catch (error: any) {
			alert(error?.response?.data?.message || "Server error");
		}
		canDelete &&
			setColumns((p) => {
				const temp = { ...p };
				delete temp[listId];
				return temp;
			});
	}

	async function updateTodoItem(value: TodoItemType, index: number) {
		const item = columns[value.listId].items[index];
		const updatedContent = value.name;
		const updatedDescription = value.description;

		let changeState = false;

		try {
			await TodoItemApi.UpdateTodoItem(value._id, {
				description: value.description,
				listId: value.listId,
				name: value.name,
				order: value.order,
			});
			changeState = true;
		} catch (error: any) {
			alert(error?.response?.data?.message || "Server error");
		}

		changeState &&
			setColumns((p) => {
				const updateItem = {
					...item,
					name: updatedContent,
					description: updatedDescription,
				};
				const prev = {
					...p,
				};
				prev[value.listId].items[index] = updateItem;
				return prev;
			});
	}

	async function editTodoList(name: string, desc: string) {

    if (!editTodoListId || !(name && desc) || !(editTodoListId in columns)) {
      return;
    }
    const list = {name, description: desc};
    try {
      await TodoListApi.UpdateTodoList(list, editTodoListId);
      setColumns(p => {
        return {...p, [editTodoListId]: {items: p[editTodoListId].items, ...list}};
      });
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Server error');
    }
  }

	async function addNewColumn(name: string, description: string) {
		if (!name || !description) return;
    if (name in columns) {
      alert(`Todo list with ${name} name already exists`);
      return;
    }
		try {
			const response = await TodoListApi.InsertTodoList({
				name,
				description,
			});
			const newListId = response.data._id;
			const newCols: ListColumnType = {
				...columns,
				[newListId]: { items: [], name, description },
			};
			setColumns(newCols);
		} catch (error: any) {
			console.log(error);
			alert(error?.response?.data?.message || "Server error");
		}
	}

  async function OnTodoItemDelete(id:string, listId: string) {
    if (!confirm("Are you sure want to delete todo item")) return;
    try {
      await TodoItemApi.DeleteTodoItem(id);
      setColumns(p => {
        const tempItems = [...p[listId].items].filter(x => x._id != id);
        return {...p, [listId]: {...p[listId], items: tempItems}}
      });
    } catch (error: any) {
      
    }
  }

	return (
		<div className="m-0 p-0 max-w-[90vw]">
			<div className="flex mx-auto flex-row overflow-x-auto h-[calc(90vh-70px)]">
				<DragDropContext onDragEnd={onDragEnd}>
					{Object.entries(columns).map(([columnID, column]) => {
						return (
							<div
								key={columnID}
								className="py-2 mx-2 flex flex-col items-center"
							>
								<div className="bg-slate-200 pt-2 pb-1 w-full flex justify-between px-3 items-center">
									<h2 className="font-semibold">
										{column.name}
									</h2>
									<div>
										<Button
											variant={"ghost"}
											title="Edit TODO list"
											size={"sm"}
											onClick={() =>{
                        setEditTodoListId(columnID);
                        setEditTodoListDialogOpened(true);
                      }}
											className="p-1"
										>
											<PencilIcon className="w-4 text-blue-600" />
										</Button>
										<Button
											title="Add new TODO Item"
											variant={"ghost"}
											size={"sm"}
											onClick={() => {
												setNewTodoListId(columnID);
												setNewTodoDialogOpened(true);
											}}
											className="p-1"
										>
											<PlusCircleIcon className="w-4 text-green-600" />
										</Button>
										<Button
											title="Delete TODO list"
											variant={"ghost"}
											size={"sm"}
											onClick={() =>
												deleteColumn(columnID)
											}
											className="p-1"
										>
											<XCircleIcon className="w-4 text-red-500" />
										</Button>
									</div>
								</div>
								<p className="bg-slate-200 w-full text-sm italic px-3">
									{column.description}
								</p>
								<div>
									<Droppable
										droppableId={columnID}
										key={columnID}
									>
										{(provided, snapshot) => {
											return (
												<div
													{...provided.droppableProps}
													ref={provided.innerRef}
													className={`min-h-[100px] min-w-[250px] py-2 max-w-[320px] ${
														snapshot.isDraggingOver
															? "bg-slate-300"
															: "bg-slate-200"
													} flex flex-col gap-2 items-center`}
												>
													{column.items.map(
														(item, idx) => {
															return (
																<Draggable
																	key={
																		item._id
																	}
																	draggableId={
																		item._id
																	}
																	index={idx}
																>
																	{(p, s) => {
																		return (
																			<TodoItem
                                        onDeleteClicked={OnTodoItemDelete}
																				isDragging={
																					s.isDragging
																				}
																				data={{
																					_id: item._id,
																					name: item.name,
																					description:
																						item.description,
																					listId: columnID,
																					order: idx,
																				}}
																				index={
																					idx
																				}
																				onEditComplete={
																					updateTodoItem
																				}
																				style={
																					p
																						.draggableProps
																						.style
																				}
																				customRef={
																					p.innerRef
																				}
																				{...p.dragHandleProps}
																				{...p.draggableProps}
																			/>
																		);
																	}}
																</Draggable>
															);
														}
													)}
													{provided.placeholder}
												</div>
											);
										}}
									</Droppable>
								</div>
							</div>
						);
					})}
					<button
						onClick={() => setNewTodoListDialogOpened(true)}
						className="border-2 shadow-sm bg-violet-900 text-3xl text-white p-2 rounded-sm hover:bg-violet-800 active:bg-violet-900 transition-colors duration-100 h-[120px]"
					>
						+
					</button>
				</DragDropContext>
			</div>

			{/* New TODO */}
			<TodoItemDialog
				description=""
				name=""
				onDoneClicked={(name, desc) =>
					createTodoItem(newTodoListId, name, desc)
				}
				open={newTodoDialogOpened}
				onOpenChanged={setNewTodoDialogOpened}
			/>

			{/* New List */}
			<TodoItemDialog
				description=""
				name=""
				title="New TODO List"
				open={newTodoListDialogOpened}
				onOpenChanged={setNewTodoListDialogOpened}
				onDoneClicked={addNewColumn}
			/>

			{/* Edit List */}
			<TodoItemDialog
				description={columns[editTodoListId]?.description || ''}
				name={columns[editTodoListId]?.name || ''}
				title="Edit TODO List"
				open={editTodoListDialogOpened}
				onOpenChanged={setEditTodoListDialogOpened}
				onDoneClicked={editTodoList}
			/>
		</div>
	);
};

export default KanbanBoard;
