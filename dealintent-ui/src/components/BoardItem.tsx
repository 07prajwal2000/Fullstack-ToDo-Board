'use client';

import { TodoBoardType } from "@/types/todoBoardType";
import React, { useState } from "react";
import { EyeIcon, TrashIcon, PencilIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogOverlay,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import Link from "next/link";

interface BoardItemPropsType extends TodoBoardType {
	onDeleteClicked: (id: string) => void;
	onEdit: (id: string, name: string, description: string) => void;
}

const BoardItem: React.FC<BoardItemPropsType> = (props) => {
	function onDeleteClick() {
		if (!confirm(`Are you sure want to delete the '${props.name}' board`))
			return;
		props.onDeleteClicked(props._id);
	}

	function saveClicked(name: string, description: string) {
    props.onEdit(props._id, name, description);
  }

	return (
		<div className="w-[280px] p-2 border-2 flex flex-col gap-2 h-[170px] rounded-sm bg-slate-50">
			<h2 className="text-lg font-bold">{props.name}</h2>
			<hr className="p-[1px] bg-slate-800 w-full mx-auto" />
			<p className="text-[.85rem]">{props.description}</p>
			<div className="mt-auto flex flex-row gap-2 ml-auto">
				<Link href={`/board?id=${props._id}`}>
					
				<Button
					title="Open Board"
					variant={"outline"}
					size={"sm"}
					className="mt-auto"
					>
					<EyeIcon className="w-4" />
				</Button>
					</Link>
				<BoardDialog
          data={{_id: props._id, description: props.description, name: props.name}}
					onDoneClicked={saveClicked}
					title={
						<>
							Edit{" "}
							<span className="font-bolder">{props.name}</span>{" "}
							Board
						</>
					}
				>
					<Button
						title="Open Board"
						variant={"outline"}
						size={"sm"}
						className="mt-auto text-blue-500 hover:text-blue-700"
					>
						<PencilIcon className="w-4" />
					</Button>
				</BoardDialog>
				<Button
					variant={"outline"}
					onClick={onDeleteClick}
					title={`Delete '${props.name}' Board`}
					size={"sm"}
					className="text-red-400 transition-colors duration-100 active:bg-red-300 hover:bg-red-200 hover:text-red-600"
				>
					<TrashIcon className="w-4" />
				</Button>
			</div>
		</div>
	);
};

type BoardDialogPropsType = {
	data?: TodoBoardType;
	title?: string | React.ReactNode;
	onDoneClicked?: (name: string, desc: string) => void;
	children?: React.ReactNode;
};

export function BoardDialog(props: BoardDialogPropsType) {
	const [name, setName] = useState(props.data?.name || "");
	const [description, setDescription] = useState(
		props.data?.description || ""
	);

	function onSaveClicked() {
		props.onDoneClicked && props.onDoneClicked(name, description);
	}

	return (
		<Dialog>
			<DialogTrigger>{props.children}</DialogTrigger>
			<DialogOverlay className="top-0 bottom-0 left-0 right-0 bg-blue-100/5" />
			<DialogContent>
				<DialogTitle>{props?.title || "Title"}</DialogTitle>

				<div className="flex flex-col gap-3">
					<Input
						placeholder="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<Input
						placeholder="Description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>

				<div className="flex flex-row justify-end">
					<DialogClose className="">
						<Button size={"sm"} variant={"ghost"}>
							Close
						</Button>
					</DialogClose>
					<DialogClose className="">
						<Button
							onClick={onSaveClicked}
							size={"sm"}
							variant={"ghost"}
							className="text-green-600 hover:text-green-700"
						>
							Save
						</Button>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default BoardItem;
