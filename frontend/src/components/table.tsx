import { useLocation } from "wouter";
import type { User } from "../types/users";
import { toast } from "sonner";
import { deleteUser } from "../api/user";

interface TableProps {
  data: User[];
}

const Table = ({ data }: TableProps) => {
  const [, navigate] = useLocation();

  const handleEdit = (userId: number) => {
    navigate(`/users/${userId}/edit`);
  };

  const handleDeleteUser = async (userId: number) => {
    const confirmed = confirm(
      "Are you sure you want to delete this user. This action is irreversible.",
    );

    if (!confirmed) return;

    try {
      const data = await deleteUser(userId);

      toast.success(data.message);
      navigate("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete user";
      toast.error(message);
      console.log(error);
    }
  };

  return (
    <table>
      <thead className="text-slate-900 text-left text-sm font-semibold border-b border-slate-300 whitespace-nowrap">
        <tr>
          <th scope="col" className="pl-0 px-3 py-3.5">
            ID
          </th>
          <th scope="col" className="px-3 py-3.5">
            Name
          </th>
          <th scope="col" className="px-3 py-3.5">
            Username
          </th>
          <th scope="col" className="px-3 py-3.5">
            Email
          </th>
          <th scope="col" className="pr-0 px-3 py-3.5">
            Actions
          </th>
        </tr>
      </thead>

      <tbody className="text-sm divide-y divide-slate-200">
        {data.length ? (
          data.map((user) => (
            <tr key={user.id}>
              <td className="pl-0 px-3 py-3 font-medium text-slate-900 whitespace-nowrap">
                {user.id}
              </td>
              <td className="px-3 py-3 text-slate-500">{user.name}</td>
              <td className="px-3 py-3 text-slate-500">{user.username}</td>
              <td className="px-3 py-3 text-slate-500">{user.email}</td>
              <td className="pr-0 px-3 py-3 flex gap-3">
                <button
                  type="button"
                  className="text-sm text-indigo-500 cursor-pointer hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                  aria-label={`Edit ${user.name}`}
                  onClick={() => handleEdit(user.id)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="text-sm text-red-700 dark:text-red-500 cursor-pointer hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
                  aria-label={`Delete ${user.name}`}
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} className="text-center pt-10 text-slate-500">
              No record found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
