import { useEffect, useState, type SubmitEvent } from "react";
import { toast } from "sonner";
import { useLocation, useSearchParams } from "wouter";

import type { Pagination as PaginationType, User } from "../../types/users";

import Table from "../../components/table";
import Pagination from "../../components/pagination";
import { getUsers } from "../../api/user";

const UserPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [_, navigate] = useLocation();

  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationType>(
    {} as PaginationType,
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers(searchParams.toString());

        setPagination(data.pagination as PaginationType);
        setUsers(data.data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to fetch user";
        toast.error(message);
        console.log(error);
      }
    };

    fetchUsers();
  }, [searchParams]);

  const handlePageChange = (pageNum: number) => {
    setSearchParams((prev) => {
      prev.set("page", String(pageNum));
      return prev;
    });
  };

  const handleSearch = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as { q: string };

    if (data.q === "") {
      setSearchParams((prev) => {
        prev.delete("q");
        return prev;
      });
      return;
    }

    setSearchParams(data);
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto gap-5 pt-5">
      <h1 className="text-3xl font-semibold">Users</h1>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <form
            onSubmit={handleSearch}
            className="flex items-center border pl-4 gap-2 bg-white border-gray-500/30 h-11.5 rounded-full overflow-hidden max-w-md w-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="#6B7280"
            >
              <path d="M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8" />
            </svg>
            <input
              type="text"
              name="q"
              className="w-full h-full outline-none text-sm text-gray-500"
              placeholder="Search name, username, or email"
            />
            <button
              type="submit"
              className="bg-indigo-500 w-32 h-9 rounded-full text-sm text-white mr-1.25 cursor-pointer"
            >
              Search
            </button>
          </form>
          <button
            type="button"
            className="w-32 h-9 active:scale-95 transition text-sm text-white rounded-full bg-indigo-500 cursor-pointer"
            onClick={() => navigate("/users/create")}
          >
            <p className="mb-0.5">Add New User</p>
          </button>
        </div>
        <Table data={users} />
        <Pagination
          currentPage={pagination.page}
          pageSize={pagination.limit}
          totalCount={pagination.total}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default UserPage;
