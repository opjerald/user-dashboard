import { useForm, type RegisterOptions } from "react-hook-form";
import type { UserForm } from "../types/users";

interface FormFieldProps {
  label: string;
  name: keyof UserForm;
  register: ReturnType<typeof useForm<UserForm>>["register"];
  options?: RegisterOptions<UserForm, keyof UserForm>;
  error?: string;
  placeholder: string;
  type?: string;
}

const INPUT_CLASS = "h-full px-2 w-full outline-none bg-transparent pl-3";

const FormField = ({
  label,
  name,
  register,
  options,
  error,
  placeholder,
  type = "text",
}: FormFieldProps) => {
  return (
    <div>
      <label htmlFor={name} className="font-medium">
        {label}
        <span className="text-red-500 text-xs">*</span>
      </label>

      <div className="flex items-center mt-2 h-10 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden">
        <input
          id={name}
          type={type}
          {...register(name, options)}
          className={INPUT_CLASS}
          placeholder={placeholder}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default FormField;
