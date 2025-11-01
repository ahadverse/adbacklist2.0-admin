"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { BsEye } from "react-icons/bs";
import ConfirmDeleteModal from "../modals/Delete";
import Link from "next/link";
import { CiEdit } from "react-icons/ci";


interface Blog {
  _id: string;
  title: string;
  category: string;
  subCategory: string;
  image: string;
  createdAt: string;
}

interface BlogsTableProps {
  blogs: Blog[];
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BlogsTable({ blogs, reload, setReload }: BlogsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  isHeader
                >
                  Image
                </TableCell>
                <TableCell
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  isHeader
                >
                  Title
                </TableCell>
                <TableCell
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  isHeader
                >
                  Category
                </TableCell>
                <TableCell
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  isHeader
                >
                  Subcategory
                </TableCell>
                <TableCell
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  isHeader
                >
                  Created At
                </TableCell>
                <TableCell
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  isHeader
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {blogs.map((blog) => (
                  <TableRow key={blog._id}>
                    {/* Image */}
                    <TableCell className="px-5 py-4 text-start">
                      <img
                        src={blog.image?.startsWith("http") ? blog.image : `https://dk3vy6fruyw6l.cloudfront.net/${blog.image}`}
                        alt={blog.title}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    </TableCell>

                    {/* Title */}
                    <TableCell className="px-5 py-4 text-gray-700 text-start text-theme-sm dark:text-gray-300 font-medium">
                      {blog.title}
                    </TableCell>

                    {/* Category */}
                    <TableCell className="px-5 py-4 text-gray-600 text-start text-theme-sm dark:text-gray-400 capitalize">
                      {blog.category}
                    </TableCell>

                    {/* Subcategory */}
                    <TableCell className="px-5 py-4 text-gray-600 text-start text-theme-sm dark:text-gray-400 capitalize">
                      {blog.subCategory}
                    </TableCell>

                    {/* Created At */}
                    <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {new Date(blog.createdAt).toLocaleString()}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-5 py-4 flex gap-2 items-center">
                      <ConfirmDeleteModal
                        id={blog._id}
                        reload={reload}
                        route="blogs"
                        setReload={setReload}
                      />
                      <Link href={`/blogs/update-blog/${blog._id}`} className="p-2">
                        <CiEdit className="text-white text-lg" />
                      </Link>
                      <Link href={`/blogs/details/${blog._id}`} className="p-2">
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
