import { InputHTMLAttributes } from "react";

interface FormInputProps {
  name: string;
  errors?: string[];
}

export default function FormInput({
  name,
  errors = [],
  ...rest
}: FormInputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <input
        name={name}
        className={` w-full h-10 px-4 bg-transparent rounded-xl focus:outline-none border-none ring-2 focus:ring-4 transition ${
          errors.length ? "ring-red-500" : "ring-slate-300 "
        }`}
        {...rest}
      ></input>
      {errors?.map((error, index) => (
        <span key={index} className="text-red-600">
          {error}
        </span>
      ))}
    </div>
  );
}
