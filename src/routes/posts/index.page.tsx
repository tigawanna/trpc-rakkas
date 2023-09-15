import { TheFormModal } from "@/shared/modal/TheFormModal";
import { trpc } from "@/utils/trpc";
import { Head } from "rakkasjs";
import { PostsForm } from "./components/PostsForm.1";
import { Plus } from "lucide-react";

export default function postsPage() {
  const query = trpc.posts.getFullList.useQuery();

  return (
    <div className="flex flex-col w-full min-h-screen gap-2">
      <Head title="User page" />
      <div className="w-full flex justify-between">
        <div className="w-full flex justify-center">
          <h1 className="text-3xl font-bold">Posts</h1>
        </div>

        <div className="min-w-10 flex justify-center p-2">
          <TheFormModal
            label={<Plus className="h-10 w-10 hover:text-accent" />}
            id="add-post-modal-id"
          >
            <PostsForm />
          </TheFormModal>
        </div>
      </div>

      <div className="w-full flex flex-wrap gap-2">
        {query.data?.map((item) => (
          <div key={item.id} className="p-1 border flex flex-col gap-1">
            <h2 className="w-full p-1 text-2xl font-bold">{item.title}</h2>
            <p className="w-full p-1 line-clamp-3">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
