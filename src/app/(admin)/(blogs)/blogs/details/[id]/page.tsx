'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import baseApi from '@/utils/axiosIntance';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface Blog {
  _id: string;
  title: string;
  permalink: string;
  metaKey: string;
  metaDesc: string;
  category: string;
  subCategory: string;
  desc: string;
  status: string;
  image: string;
  writer: string;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
}

const BlogDetail = () => {
  const { id } = useParams(); // get blog ID from URL
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await baseApi.get(`/blogs/${id}`);
        setBlog(res.data?.data?.blogs?.[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <p className="flex justify-center items-center h-64">
        <AiOutlineLoading3Quarters className="animate-spin text-3xl text-gray-800 dark:text-white" />
      </p>
    );
  }

  if (!blog) {
    return <p className="text-center text-red-500">Blog not found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      {/* Title */}
      <h1 className="text-4xl font-extrabold mb-6 text-gray-900 dark:text-white">{blog.title}</h1>

      {/* Blog Image */}
      {blog.image && (
        <div className="mb-6">
          <img
            src={blog.image?.startsWith('http') ? blog.image : `https://dk3vy6fruyw6l.cloudfront.net/${blog.image}`}
            alt={blog.title}
            className="w-fit h-[250px] m-auto rounded-xl shadow-md"
          />
        </div>
      )}

      {/* Metadata Card */}
      <div className="mb-6 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-inner">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Blog Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-gray-700 dark:text-gray-300 text-sm">
          <div className="flex">
            <span className="font-semibold w-32">Category:</span>
            <span>{blog.category}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32">SubCategory:</span>
            <span>{blog.subCategory}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32">Status:</span>
            <span>{blog.status}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32">Writer:</span>
            <span>{blog.writer}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32">Deleted:</span>
            <span>{blog.isDelete ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32">Created At:</span>
            <span>{new Date(blog.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32">Updated At:</span>
            <span>{new Date(blog.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6 text-gray-800 dark:text-gray-200 prose max-w-full">
        <div dangerouslySetInnerHTML={{ __html: blog.desc }} />
      </div>

      {/* Meta Information */}
      <div className="mb-6 space-y-2 text-sm text-gray-500 dark:text-gray-400">
        <p>
          <strong>Meta Description:</strong> {blog.metaDesc}
        </p>
        <p>
          <strong>Meta Keywords:</strong> {blog.metaKey}
        </p>
      </div>

      {/* Link */}
      <a
        href={`https://adbacklist.com/blog/${blog.permalink}`}
        target="_blank"
        className="inline-block px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
      >
        View on Website
      </a>
    </div>
  );
};

export default BlogDetail;
