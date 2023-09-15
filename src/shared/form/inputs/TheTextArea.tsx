import { twMerge } from "tailwind-merge"

interface TheTextAreaProps<T>
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  field_key: keyof T;
  field_name: string;
  description_classname?: string;
  container_classname?: string;
  label_classname?: string;
  output_classname?: string;
  editing?: boolean;
  description?: string;
}

export function TheTextAreaInput<T,>({field_key,field_name,editing=true,...props}:TheTextAreaProps<T>){
return (
  <div
    key={field_key as string}
    className={twMerge(
      "flex w-full flex-col justify-center",
      props.container_classname
    )}
  >
    <label
      htmlFor={field_key as string}
      className={twMerge(
        "px-2 font-serif text-sm font-bold",
        props.label_classname
      )}
    >
      {field_name as string}
    </label>
    {editing ? (
      <div className="flex w-full flex-col ">
        <textarea
        {...props}
          id={field_key as string}
          name={field_key as string}
          title={props.placeholder}
          className={twMerge("textarea textarea-bordered textarea-sm w-full border border-accent",props.className
          )}
        />
        {props.description && (
          <p className={twMerge("text-xs italic", props.description_classname)}>
            {props.description}
          </p>
        )}
      </div>
    ) : (
      <div
        className={twMerge(
          "w-full border-b px-2 py-1 text-sm",
          props.output_classname
        )}
      >
        {props.value}
      </div>
    )}
  </div>
);
}
