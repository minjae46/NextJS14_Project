interface FormInputProps {
  name: string;
  type: string;
  placeholder: string;
  required: boolean;
  errors: string[];
}

export default function FormInput({
  name,
  type,
  placeholder,
  required,
  errors,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full h-10 px-4 bg-transparent rounded-xl outline-none border-none ring-2 ring-slate-300 focus:ring-4 transition"
      ></input>
      {errors.map((error, index) => (
        <span key={index} className="text-red-600">
          {error}
        </span>
      ))}
    </div>
  );
}
