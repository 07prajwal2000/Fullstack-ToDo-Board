import TodoBoardApi from "@/api/todoBoard";
import { BoardDialog } from "@/components/BoardItem";
import Navbar from "@/components/Navbar";
import TodoBoardGrid from "@/components/TodoBoardGrid";
import { Button } from "@/components/ui/button";
import { TodoBoardType } from "@/types/todoBoardType";
import ApiResponse from "@/types/todoListType";
import { TableIcon, GithubIcon } from "lucide-react";
import "../app/globals.css";
import { useState } from "react";

async function getData(): Promise<ApiResponse<TodoBoardType[]> | null> {
	try {
		const data = await TodoBoardApi.GetTodoBoard();
		return data;
	} catch (e: any) {
		return e?.response?.data;
	}
}

export const getServerSideProps = async () => {
	const data = await getData();

	return {
		props: data!,
	};
};

export default function Home(data: ApiResponse<TodoBoardType[]> | null) {
	const [boards, setBoards] = useState(data?.data || []);

	if (!data || !data.success) {
		return (
			<div>
				<h2 className="text-center text-red-400">
					{data?.message || "Server error"}
				</h2>
			</div>
		);
	}

	async function onModalClose(name: string, description: string) {
		if (!name && !description) return;
		try {
			const response = await TodoBoardApi.InsertTodoBoard({
				description,
				name,
			});
			setBoards((p) => {
				const t = [...p];
				t.push({ description, name, _id: response.data._id });
				return t;
			});
			window.location.reload();
		} catch (e: any) {
			alert(e?.response?.data?.message || "Server error");
		}
	}

	return (
		<div className="container">
			<Navbar
				children={
					<div>
						<BoardDialog
							title="Add New Board"
							onDoneClicked={onModalClose}
						>
							<Button size={"sm"} variant={"outline"}>
								<TableIcon className="w-6 mr-1" /> Add New Board
							</Button>
						</BoardDialog>
						<div className="absolute flex flex-row items-center justify-center bottom-0 right-0 p-4 text-sm gap-2 text-slate-500">
							<a href="https://github.com/07prajwal2000/Dealintent-Assignment" className="p-1 rounded-md bg-blue-200" target="_blank"><GithubIcon /></a>
							<p className="">Developed by Prajwal</p>
						</div>
					</div>
				}
			/>
			<TodoBoardGrid data={boards} />
		</div>
	);
}
