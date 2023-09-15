import { TheTextInput } from "@/shared/form/inputs/TheTextInput";
import { useFormHook } from "@/shared/form/useForm";
import { TheTextAreaInput } from "@/shared/form/inputs/TheTextArea";
import { trpc } from "@/utils/trpc";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";

interface postsFormProps {
closeModal?: () => void
}

export function PostsForm({closeModal }: postsFormProps) {
    const create_mutation = trpc.posts.create.useMutation();
    const ctx = trpc.useContext();

    const { input, handleChange, } = useFormHook({
        initialValues: {
            title: '',
            body: '',
        }
    });
    function handleSumbit(e: any) {
        e.preventDefault();
        create_mutation.mutateAsync(input).then(() => {
            ctx.posts.getFullList.invalidate();
              toast("Project added successfully", { type: "success" });
            closeModal&&closeModal();
        }).catch((err) => {
            toast(err.message, { type: "error" });
        })
    }
    return (
      <div className="w-full h-full flex items-center justify-center">
        <form className="w-full flex flex-col gap-2" onSubmit={handleSumbit}>
          <TheTextInput
            field_name={"title"}
            field_key={"title"}
            onChange={handleChange}
          />
          <TheTextAreaInput
            field_name={"body"}
            field_key={"body"}
            onChange={handleChange}
          />
          {/* {create_mutation.isLoading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <button>create</button>
          )} */}

          <div className="flex w-full items-center justify-center">
            <button className="btn btn-sm  mt-2 w-[80%] sm:w-[70%] md:w-[40%] ">
              {create_mutation.isLoading ? (
                <Loader className="h-6 w-6 animate-spin" />
              ) : (
                <div></div>
              )}
            Create
            </button>
          </div>
        </form>
      </div>
    );
}
