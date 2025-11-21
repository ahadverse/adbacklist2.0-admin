'use client';

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import baseApi from "@/utils/axiosIntance";
import categories from "../../../../../../../public/category.json";
import UploadImageModal from "@/components/modals/ImageUpload";

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false }
);
interface BlogForm {
  title: string;
  category: string;
  subCategory: string;
  image: File | null;
  permalink: string;
  metaKey: string;
  metaDesc: string;
  writer: string;
  status: string;
  desc: string;
}

const UpdateBlog = () => {
  const router = useRouter();
  const { id }: any = useParams();

  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [subCategoryOptions, setSubCategoryOptions] = useState<{ label: string; value: string }[]>([]);

  const [form, setForm] = useState<BlogForm>({
    title: "",
    category: "",
    subCategory: "",
    image: null,
    writer: "",
    status: "published",
    desc: "",
    permalink: "",
    metaKey: "",
    metaDesc: "",
  });


  const apiToken = "85y33d08bi5k84w3nxa07aq607ko8v165dau2joyygooce9j";

  const fetchBlog = async () => {
    try {
      const res = await baseApi.get(`/blogs/${id}`);
      const data = res.data?.data?.blogs?.[0];

      setForm({
        title: data.title,
        category: data.category,
        subCategory: data.subCategory,
        image: data.image,
        writer: data.writer,
        status: data.status,
        desc: data.desc,
        permalink: data.permalink,
        metaDesc: data.metaDesc,
        metaKey: data.metaKey,
      });

      setImagePreview(data.image ? data.image : null);

      // Set subcategories for existing category
      const selectedCat = categories.find((cat: any) => cat.slug === data.category);
      if (selectedCat?.subcategories) {
        setSubCategoryOptions(
          selectedCat.subcategories.map((sub: any) => ({ label: sub.name, value: sub.slug }))
        );
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load blog data");
      router.push("/blogs-list");
    }
  };


  useEffect(() => {
    setMounted(true);
    fetchBlog();
  }, [id]);

  if (!mounted) return null;


  // Input Handlers
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategorySelect = (e: any) => {
    const value = e.target.value;
    setForm({ ...form, category: value, subCategory: "" });

    const selectedCat = categories.find((cat: any) => cat.slug === value);
    if (selectedCat?.subcategories) {
      setSubCategoryOptions(
        selectedCat.subcategories.map((sub: any) => ({ label: sub.name, value: sub.slug }))
      );
    } else setSubCategoryOptions([]);
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm({ ...form, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  // Submit Update
  const handleUpdate = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    let imageField = form.image;

    if (form.image instanceof File) {
      const formData = new FormData();
      formData.append("images", form.image);
      try {
        const res = await baseApi.post("/files2/files", formData);
        imageField = res.data?.[0];
      } catch {
        toast.error("Image upload failed");
        setLoading(false);
        return;
      }
    }

    try {
      await baseApi.patch(`/blogs/${id}`, { ...form, image: imageField });
      toast.success("Blog updated successfully");
      router.push("/blogs-list");
    } catch (err: any) {
      toast.error(err?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] text-black dark:text-white p-5 md:p-6">
      <h1 className="text-2xl font-bold mb-6"></h1>
   <div className="sm:px-10 flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-6">Update Blog</h1>
 <UploadImageModal />
    </div>

      <form onSubmit={handleUpdate} className="space-y-6 p-5 w-10/12 m-auto rounded bg-white dark:bg-white/[0.03]">

        {/* Image Upload */}
        <div>
          <label className="block mb-1 font-medium">Image</label>
          {imagePreview ? (
            <div className="relative w-40">
              <img src={imagePreview} className="w-40 h-40 object-cover rounded border dark:border-gray-700" />
              <button
                type="button"
                onClick={() => {
                  setForm({ ...form, image: null });
                  setImagePreview(null);
                }}
                className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full"
              >
                ×
              </button>
              <button
                type="button"
                onClick={() => window.open(imagePreview!, "_blank")}
                className="absolute top-5 -right-2 bg-red-600 text-white w-6 h-6 rounded-full"
              >
                <FaEye className="text-xs m-auto" />
              </button>
            </div>
          ) : (
            <label className="w-40 h-40 border border-dashed border-gray-400 dark:border-gray-600 rounded flex items-center justify-center text-sm text-gray-500 hover:border-red-500 cursor-pointer">
              <span>Change Image</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          )}
        </div>

        {/* Title */}
        <input type="text" name="title" value={form.title} onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700" />
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
            <label className="block mb-1 font-medium">Meta Keywords</label>
            <input
              type="text"
              name="metaKey"
              value={form.metaKey}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
            />
          </div>    <div className="flex-1">
            <label className="block mb-1 font-medium">Meta Descriptions</label>
            <input
              type="text"
              name="metaDesc"
              value={form.metaDesc}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
            />
          </div>

          
        </div>
        {/* Category / SubCategory */}

        <div className="flex gap-4">
          <select name="category" value={form.category} onChange={handleCategorySelect}
            className="flex-1 px-4 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700">
            <option value="">Select Category</option>
            {categories.map((cat: any) => (
              <option key={cat.slug} value={cat.slug}>{cat.name}</option>
            ))}
          </select>

          <select name="subCategory" value={form.subCategory} onChange={handleChange}
            className="flex-1 px-4 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700">
            <option value="">Select Subcategory</option>
            {subCategoryOptions.map((sub) => (
              <option key={sub.value} value={sub.value}>{sub.label}</option>
            ))}
          </select>
        </div>

        {/* Writer + Status */}
        <div className="flex gap-4">
          <input type="text" name="writer" value={form.writer} onChange={handleChange}
            className="flex-1 px-4 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700" />
          <select name="status" value={form.status} onChange={handleChange}
            className="flex-1 px-4 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Description */}
        <Editor apiKey={apiToken} value={form.desc} onEditorChange={(content) => setForm({ ...form, desc: content }) } init={{
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
              }} />

        {/* Save Button */}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 w-[150px] bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? <AiOutlineLoading3Quarters className="animate-spin m-auto" /> : "Update Blog"}
        </button>

      </form>
    </div>
  );
};

export default UpdateBlog;
