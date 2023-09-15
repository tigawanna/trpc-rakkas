import { trpc } from "@/utils/trpc";

export default function HomePage() {
	const query = trpc.hello.hey.useQuery();
	return (
		<main className="flex flex-col gap-2 items-center">
			<h1>Hello world!</h1>
			<h3>{query?.data}</h3>
		</main>
	);
}
