"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogOverlay,
	DialogPortal,
	DialogClose,
} from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Edit } from "lucide-react";

type TodoItemDialogType = {
	name: string;
	description: string;
	onDoneClicked: (name: string, desc: string) => void;
	editing?: boolean;
	open?: boolean;
	onOpenChanged?: any;
	title?: string;
	showButtons?: boolean;
};

export default function TodoItemDialog(props: TodoItemDialogType) {
	const [name, setName] = useState(props.name);
	const [desc, setDesc] = useState(props.description);

	useEffect(() => {
		!props.editing && setName(props.name);
		!props.editing && setDesc(props.description);
	}, [props.open]);

	return (
		<Dialog open={props.open} onOpenChange={props.onOpenChanged}>
			{props?.showButtons && <DialogTrigger asChild>
				<Button variant="ghost" size={"sm"}>
					<Edit className="w-4" />
				</Button>
			</DialogTrigger>}
			<DialogPortal>
				<DialogOverlay className="bg-[rgb(51,65,85,0.3)] fixed top-0 bottom-0 left-0 right-0 transition-colors duration-100 flex justify-center items-center">
					<DialogContent className="">
						<div className="py-4 px-8 w-[40vw] bg-slate-100 rounded-md">
							<h2 className="text-center font-bold text-xl">
								{props.title ? props.title : props.editing ? "Edit Todo Item" : "Add Todo Item"} 
							</h2>
							<hr className="p-[1px] bg-slate-600 mt-2 mb-4" />
							<div className="flex flex-col gap-3">
								<div>
									<Label htmlFor="name">Name</Label>
									<Input
										className="my-1"
										id="name"
										value={name}
										onChange={(e) =>
											setName(e.target.value)
										}
										placeholder="Name"
									/>
								</div>
								<div>
									<Label htmlFor="desc">
										Description
									</Label>
									<Input
										className="my-1"
										id="desc"
										value={desc}
										onChange={(e) =>
											setDesc(e.target.value)
										}
										placeholder="Description"
									/>
								</div>
								<DialogClose className="w-full">
									<Button
									className="w-full"
										onClick={() =>
											props.onDoneClicked(name, desc)
										}
									>
										{props.editing ? "Save" : "Add"}
									</Button>
								</DialogClose>
							</div>
						</div>
					</DialogContent>
				</DialogOverlay>
			</DialogPortal>
		</Dialog>
	);
}
