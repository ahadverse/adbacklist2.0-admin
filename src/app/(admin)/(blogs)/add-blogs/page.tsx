'use client'

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import baseApi from "@/utils/axiosIntance";
import categories from "../../../../../public/category.json";
import UploadImageModal from "@/components/modals/ImageUpload";

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then(mod => mod.Editor),
  { ssr: false }
);

interface BlogForm {
  title: string;
  category: string;
  subCategory: string;
  image: File | null;
  permalink: string;
  writer: string;
  status: string;
  desc: string;
}

const AddBlog = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [subCategoryOptions, setSubCategoryOptions] = useState<{ label: string; value: string }[]>([]);
  const [form, setForm] = useState<BlogForm>({
    title: "",
    permalink: "",
    category: "",
    subCategory: "",
    image: null,
    writer: "",
    status: "published",
    desc: "",
  });
  const [token, setToken] = useState({
    token: "",
  });

    const fetchDetails = async () => {
    try {
      const res = await baseApi.get("/tiny-mce");
      setToken(res.data?.response?.token);
      setTokenLoading(false);
    } catch (err) {
      setTokenLoading(false);
      console.error(err);
      toast.error("Failed to fetch details");
    }
  };

  useEffect(() => {
    setTokenLoading(true);
    fetchDetails();
  }, []);


  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // ---------------- Handlers ---------------- //

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setForm({ ...form, category: value, subCategory: "" });

    const selectedCat = categories.find((cat: any) => cat.slug === value);
    if (selectedCat?.subcategories?.length) {
      setSubCategoryOptions(
        selectedCat.subcategories.map((sub: any) => ({ label: sub.name, value: sub.slug }))
      );
    } else {
      setSubCategoryOptions([]);
    }
  };

  const handleSubCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, subCategory: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm({ ...form, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!form.title || !form.category || !form.desc) {
      toast.error("Title, Category and Description are required");
      setLoading(false);
      return;
    }

    // Upload image if selected
    if (form.image) {
      const formData = new FormData();
      formData.append("images", form.image);

      try {
        const res = await baseApi.post('/files2/files', formData)

        const result = await res.data;
        form.image = result?.[0];
      } catch (err) {
        console.error(err);
        toast.error("Image upload failed!");
        setLoading(false);
        return;
      }
    }

    // Submit blog
    try {
      await baseApi.post("/blogs", form);
      toast.success("Blog added successfully");

      // Reset form
      setForm({
        title: "",
        category: "",
        subCategory: "",
        permalink: "",
        image: null,
        writer: "",
        status: "published",
        desc: "",
      });
      setImagePreview(null);
      router.push("/blogs-list");
    } catch (err: any) {
      toast.error(err?.message || "Failed to add blog");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- JSX ---------------- //

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] text-black dark:text-white p-5 md:p-6">
    <div className="sm:px-10 flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-6">Add New Blog</h1>
 <UploadImageModal />
    </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-5 w-10/12 m-auto rounded bg-white dark:bg-white/[0.03] dark:border-white/[0.05]"
      >
        {/* Image Upload & Preview */}
        <div>
          <label className="block mb-1 font-medium">Image</label>
          {imagePreview ? (
            <div className="relative w-40">
              <img
                src={imagePreview}
                className="w-40 h-40 object-cover rounded border dark:border-gray-700"
              />
              {/* Remove */}
              <button
                type="button"
                onClick={() => {
                  setForm({ ...form, image: null });
                  setImagePreview(null);
                }}
                className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
              >
                ×
              </button>
              {/* View */}
              <button
                type="button"
                onClick={() => window.open(imagePreview, "_blank")}
                className="absolute top-5 -right-2 bg-gray-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
              >
                <FaEye className="text-xs" />
              </button>
            </div>
          ) : (
            <label className="w-40 h-40 border border-dashed border-gray-400 dark:border-gray-600 rounded flex items-center justify-center text-sm text-gray-500 hover:border-blue-500 cursor-pointer">
              <span>Select Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
         
        </div>

        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700"
            required
          />
        </div>
            <div className="flex-1">
            <label className="block mb-1 font-medium">Permalink</label>
            <input
              type="text"
              name="permalink"
              value={form.permalink}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
            />
          </div>
        {/* Category & Subcategory */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleCategorySelect}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat: any) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block mb-1 font-medium">Subcategory</label>
            <select
              name="subCategory"
              value={form.subCategory}
              onChange={handleSubCategorySelect}
              disabled={!subCategoryOptions.length}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 disabled:opacity-50"
            >
              <option value="">Select Subcategory</option>
              {subCategoryOptions.map((sub) => (
                <option key={sub.value} value={sub.value}>
                  {sub.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Writer & Status */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Writer</label>
            <input
              type="text"
              name="writer"
              value={form.writer}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
            />
          </div>


          <div className="flex-1">
            <label className="block mb-1 font-medium">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      

        {/* Description */}
        {tokenLoading ?  <AiOutlineLoading3Quarters className="animate-spin text-xl m-auto text-gray-800 dark:text-white" /> :  
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <div className="border rounded-md overflow-hidden dark:border-gray-700">
           {token?.token && 
           <Editor
              key={token.token} 
              apiKey={token?.token}
              value={form.desc}
              onEditorChange={(content) =>
                setForm((prev) => ({ ...prev, desc: content }))
              }
              init={{
                height: 300,
                menubar: false,
                skin: document.documentElement.classList.contains("dark")
                  ? "oxide-dark"
                  : "oxide",
                content_css: document.documentElement.classList.contains("dark")
                  ? "tinymce-5-dark"
                  : "default",
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "insertfile image media pageembed template link anchor codesample | bold italic forecolor | alignleft aligncenter " +
                  "undo redo | blocks | alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                image_caption: true,
                image_advtab: true,
              }}
            />} 
          </div>
        </div>}
       

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 w-[150px] bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? (
            <AiOutlineLoading3Quarters className="animate-spin text-xl m-auto text-gray-800 dark:text-white" />
          ) : (
            "Add Blog"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
