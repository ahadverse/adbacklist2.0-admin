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
import Link from "next/link";
import { BsEye } from "react-icons/bs";
import ConfirmDeleteModal from "../modals/Delete";
import ConfirmApproveModal from "../modals/Approved";
import baseApi from "@/utils/axiosIntance";
import Button from "../ui/button/Button";

export interface Post {
  isApproved: boolean;
  _id: string;
  name: string;
  category: string;
  subCategory: string;
  isPremium: boolean;
  createdAt: string;
}

interface PostsTableProps {
  posts: Post[];
  selectedIds?: string[];
  reload?: boolean;
  admin?: boolean;
  setReload?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIds?: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function PostsTable({
  posts,
  setReload,
  reload,
  admin,
  setSelectedIds,
  selectedIds
}: PostsTableProps) {

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(posts?.map((p) => p._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[950px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
               {admin &&  <TableCell className="px-3 py-3" isHeader>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedIds?.length === posts?.length && posts?.length > 0}
                  />
                </TableCell>}
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start" isHeader>
                  Name
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-500" isHeader>
                  Category
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-500" isHeader>
                  SubCategory
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-500" isHeader>
                  Premium
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-500" isHeader>
                  Created At
                </TableCell>
                <TableCell className="px-5 py-3 font-medium text-gray-500" isHeader>
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {posts?.map((post) => (
                <TableRow key={post._id}>
                  {/* Checkbox */}
                 {admin &&  <TableCell className="px-3 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds?.includes(post?._id)}
                      onChange={() => handleSelectOne(post?._id)}
                    />
                  </TableCell>
}
                  {/* Name */}
                  <TableCell className="px-5 py-4 text-start">
                    <span className="block w-[300px] truncate text-gray-800 dark:text-white/90 text-theme-sm">
                      {post.name}
                    </span>
                  </TableCell>

                  {/* Category */}
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm">
                    {post.category}
                  </TableCell>

                  {/* SubCategory */}
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm">
                    {post.subCategory}
                  </TableCell>

                  {/* Premium */}
                  <TableCell className="px-4 py-3 text-start">
                    <Badge size="sm" color={post.isPremium ? "success" : "primary"}>
                      {post.isPremium ? "Yes" : "No"}
                    </Badge>
                  </TableCell>

                  {/* Created At */}
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm">
                    {new Date(post.createdAt).toLocaleString()}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-4 py-3 flex items-center">
                    {admin && (
                      <>
                        <ConfirmDeleteModal
                          id={post._id}
                          reload={reload}
                          route="posts"
                          setReload={setReload}
                        />
                        <ConfirmApproveModal
                          id={post._id}
                          reload={reload}
                          route="posts"
                          isApproved={!post.isApproved}
                          setReload={setReload}
                        />
                      </>
                    )}
                    <Link
                      className="px-2 block"
                      target="_blank"
                      href={`https://adbacklist2-0.vercel.app/post/${post.category}/${post._id}`}
                    >
                      <BsEye className="dark:text-white" />
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
