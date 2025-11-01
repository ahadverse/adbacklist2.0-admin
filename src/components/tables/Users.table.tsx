"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { toast } from "react-toastify";
import baseApi from "@/utils/axiosIntance";
import ConfirmDeleteModal from "../modals/Delete";
import Link from "next/link";
import { BsEye } from "react-icons/bs";
import UpdateCreditModal from "../modals/Credit";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avater: string;
  role: string;
  isDelete: boolean;
  credit: number;
  createdAt: string;
  updatedAt: string;
}

interface UsersTableProps {
  users: User[];
  reload : boolean,
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UsersTable({ users , setReload, reload }: UsersTableProps) {

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                  User
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                  Email
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                  Role
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                  Credit
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                  Status
                </TableCell>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                  Created At
                </TableCell>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {users.map((user) => (
                <TableRow key={user._id}>
                  {/* User */}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avater}
                        alt={user.firstName}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div>
                        <span className="block capitalize font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Email */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {user.email}
                  </TableCell>

                  {/* Role */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 capitalize">
                    {user.role}
                  </TableCell>

                  {/* Credit */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {user.credit}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={!user.isDelete ? "success" : "error"}
                    >
                      {user.isDelete ? "Deleted" : "Active"}
                    </Badge>
                  </TableCell>

                  {/* Created At */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleString()}
                  </TableCell>

                  {/* Delete Button */}
                  <TableCell className="px-4 py-3 flex text-center">
                    <ConfirmDeleteModal id={user?._id} reload={reload} route="users" setReload={setReload} />
                    <UpdateCreditModal userId={user?._id} reload={reload} setReload={setReload} />
                    <Link className="px-2" href={`/users/details/${user?._id}`}>
                    <BsEye className="text-white" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
