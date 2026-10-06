import { useForm, type RegisterOptions } from "react-hook-form";
import { toast } from "sonner";
import { useLocation } from "wouter";

import type { UserForm } from "../../types/users";

import { createUser } from "../../api/user";

import FormField from "../../components/form-field";

const VALIDATION_RULES: Record<
  keyof UserForm,
  RegisterOptions<UserForm, keyof UserForm>
> = {
  name: {
    required: "Full name is required",
    minLength: {
      value: 3,
      message: "Full name must be at least 3 characters",
    },
  },
  username: {
    required: "Username is required",
    minLength: {
      value: 3,
      message: "Username must be at least 3 characters",
    },
  },
  email: {
    required: "Email is required",
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "Invalid email address",
    },
  },
};

const CreateUserPage = () => {
  const [, navigate] = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserForm>({
    defaultValues: {
      name: "",
      username: "",
      email: "",
    },
  });

  const handleCreateUser = async (formData: UserForm) => {
    try {
      const data = await createUser(formData);

      toast.success(data.message);
      navigate("/users");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create user";
      toast.error(message);
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleCreateUser)}
      className="flex flex-col items-center justify-center h-screen text-sm text-slate-800"
    >
      <div className="flex items-center justify-between w-96 pb-5">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Create New User</h1>
          <p className="text-gray-500">Fill out the details below.</p>
        </div>
        <button
          type="button"
          className="cursor-pointer active:scale-95 transition text-sm underline underline-offset-2 decoration-slate-700 text-slate-700"
          onClick={() => navigate("/users")}
        >
          <p className="mb-0.5">Back</p>
        </button>
      </div>

      <div className="max-w-96 w-full p-6 flex flex-col gap-2 border border-slate-200 rounded-md">
        <FormField
          label="Full Name"
          name="name"
          register={register}
          options={VALIDATION_RULES.name}
          error={errors.name?.message}
          placeholder="Enter you full name"
        />

        <FormField
          label="Username"
          name="username"
          register={register}
          options={VALIDATION_RULES.username}
          error={errors.username?.message}
          placeholder="Enter your username"
        />

        <FormField
          label="Email Address"
          name="email"
          register={register}
          options={VALIDATION_RULES.email}
          error={errors.email?.message}
          placeholder="Enter your email address"
          type="email"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-1 mt-5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 w-full rounded-full transition cursor-pointer"
        >
          {isSubmitting ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
};

export default CreateUserPage;
