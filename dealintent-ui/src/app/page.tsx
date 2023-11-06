"use client";

import { useEffect } from "react";
import useSWR from "swr";

export default function Home() {
	const { isLoading, data } = useSWR('/todos/list', fetcher);

  if (isLoading) {
    return <div>Loading...</div>
  }

	return <div>
    {JSON.stringify(data)}
  </div>;
}

const fetcher = () => fetch("http://localhost:3001/todos/list").then((x) => x.json())