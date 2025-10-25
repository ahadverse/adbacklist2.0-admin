'use client'
import SearchBar from '@/components/common/SearchBar';
import SelectDropdown from '@/components/common/Select';
import Pagination from '@/components/tables/Pagination';
import UsersTable from '@/components/tables/Users.table';
// import UsersTable from '@/components/tables/Users.table';
import baseApi from '@/utils/axiosIntance';
import React, { useEffect, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { toast } from 'react-toastify';

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const res = await baseApi.get(
          `/users?page=${pagination.page}&limit=${pagination.limit}&q=${search}&sortOrder=${sortOrder}`
        );
        setUsers(res.data?.users || []);
        setPagination(res.data?.pagination || pagination);
      } catch (err) {
        console.error("Error fetching user data:", err);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [sortOrder, search, pagination.page, pagination.limit, reload]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleSelect = (value: string) => {
    setSortOrder(value);
  };

  const options = [
    { label: "Latest", value: "desc" },
    { label: "Oldest", value: "asc" },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className='mb-5 flex items-center gap-2 justify-end sm:flex-row flex-col'>
        <SearchBar onChange={handleSearchChange} />
        <SelectDropdown
          options={options}
          placeholder="Choose Sort"
          onSelect={handleSelect}
        />
      </div>

      {loading ? (
        <p className="flex h-69 justify-center items-center gap-2">
          <AiOutlineLoading3Quarters className="animate-spin text-3xl text-white" />
        </p>
      ) : (
        <div>
          <UsersTable users={users} setReload={setReload} reload={reload} />
          <Pagination
            page={pagination.page}
            limit={pagination.limit}
            total={pagination.total}
            onPageChange={(e) => setPagination({ ...pagination, page: e })}
            onLimitChange={(e) => setPagination({ ...pagination, limit: e })}
          />
        </div>
      )}
    </div>
  );
};

export default Users;
