"use client";

import React from "react";
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

export interface Post {
  _id: string;
  name: string;
  category: string;
  subCategory: string;
  isPremium: boolean;
  createdAt: string;
}

interface PostsTableProps {
  posts: Post[];
}

export default function PostsTable({ posts }: PostsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                  Name
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                  Category
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                  SubCategory
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                  Premium
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                  Created At
                </TableCell>
                         <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                                  Actions
                                </TableCell>
              </TableRow>
              
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {posts?.map((post) => (
                <TableRow key={post?._id}>
                  {/* Name */}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block w-[300px] truncate text-gray-800 dark:text-white/90 text-theme-sm">{post?.name}</span>
                  </TableCell>

                  {/* Category */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {post?.category}
                  </TableCell>

                  {/* SubCategory */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {post?.subCategory}
                  </TableCell>

                  {/* Premium */}
                  <TableCell className="px-4 py-3 text-start">
                    <Badge size="sm" color={post?.isPremium ? "success" : "primary"}>
                      {post?.isPremium ? "Yes" : "No"}
                    </Badge>
                  </TableCell>

                  {/* Created At */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {new Date(post?.createdAt).toLocaleString()}
                  </TableCell>
                    <TableCell className="px-4 py-3 flex h-full justify-center items-center">
                    <Link className="px-2 block" target="_blank" href={`https://adbacklist2-0.vercel.app/post/${post?.category}/${post?._id}`}>
                    <BsEye className="text-white mt-1" />
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
