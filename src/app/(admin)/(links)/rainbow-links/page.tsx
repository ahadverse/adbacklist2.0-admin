"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import baseApi from "@/utils/axiosIntance";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Link from "next/link";

interface Details {
  _id?: string;
  text: string;
  link: string;
}

const RainbowLinks = () => {
  const [details, setDetails] = useState<Details>({
    text: "",
    link: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Details>({
    text: "",
    link: "",
  });
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const fetchDetails = async () => {
    try {
      const res = await baseApi.get("/rainbow-ads");
      setDetails(res.data?.response?.links);
      setForm(res.data?.response?.links);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
      toast.error("Failed to fetch details");
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchDetails();
  }, [reload]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setUpdateLoading(true);
    try {
      const { _id, ...rest } = form;
      await baseApi.put(`/rainbow-ads/${_id}`, rest);
      setReload(!reload);
      toast.success("Updated successfully!");
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Update failed!");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <p className="flex justify-center items-center h-64">
        <AiOutlineLoading3Quarters className="animate-spin text-3xl text-gray-800 dark:text-white" />
      </p>
    );
  }
  const words = details?.text?.split(" ");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white text-black dark:text-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <h1 className="text-2xl font-bold mb-4">Rainbow Links</h1>

      {/* Details */}
      <div className="space-y-2 bg-gray-50 dark:bg-gray-900 p-4 rounded">
       
      <div className='text-center my-14'>
        <Link href={details?.link ?? "/"}>
          {words?.map((word, index) => (
            <span
              key={index}
              style={{ color: `hsl(${index * 80}, 100%, 40%)` }}
              className='text-3xl font-bold'
            >
              {word}{" "}
            </span>
          ))}
        </Link>
      </div>
      </div>

      {/* Update Button */}
      <button
        onClick={() => setModalOpen(true)}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Update Details
      </button>

      {/* Update Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} className="max-w-md p-6">
        <h3 className="text-lg font-semibold text-center mb-4 text-gray-800 dark:text-white">
          Update Details
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block mb-1 font-medium">Text</label>
            <input
              type="text"
              name="text"
              value={form.text}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Link</label>
            <input
              type="text"
              name="link"
              value={form.link}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setModalOpen(false)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={updateLoading}
            className="px-4 py-2 w-[100px] text-center bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {updateLoading ? <AiOutlineLoading3Quarters className="animate-spin m-auto" /> : 'Update'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default RainbowLinks;
