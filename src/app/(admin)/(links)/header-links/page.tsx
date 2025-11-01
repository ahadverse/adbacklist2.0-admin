"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import baseApi from "@/utils/axiosIntance";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface Details {
_id? : string,
  shemale: string;
  meet: string;
  live: string;
}

const HeaderLinks = () => {
  const [details, setDetails] = useState<Details>({
    shemale: "",
    meet: "",
    live: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Details>({
    shemale: "",
    meet: "",
    live: "",
  });
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [reload, setReload] = useState(false);


  const fetchDetails = async () => {
    try {
      const res = await baseApi.get("/header-ads");
      setDetails(res.data?.response?.links);
      setForm(res.data?.response?.links);
       setLoading(false)
    } catch (err) {
           setLoading(false)
      console.error(err);
      toast.error("Failed to fetch details");
    }
  };

  useEffect(() => {
    setLoading(true)
    fetchDetails();
  }, [reload]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setUpdateLoading(true);
    try {
    console.log(form)
    const { _id , ...rest} = form
      const res = await baseApi.put(`/header-ads/${_id}`, rest);
   setReload(!reload)
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

  return (
    <div className="rounded-2xl border border-gray-200 bg-white text-black dark:text-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <h1 className="text-2xl font-bold mb-4">Header Links</h1>

      {/* Details */}
      <div className="space-y-2 bg-gray-50 dark:bg-gray-900 p-4 rounded">
        <p>
          <span className="font-bold text-red-700">Shemale:</span> {details.shemale}
        </p>
        <p>
          <span className="font-bold text-red-700">Meet:</span> {details.meet}
        </p>
        <p>
          <span className="font-bold text-red-700">Live:</span> {details.live}
        </p>
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
            <label className="block mb-1 font-medium">Shemale</label>
            <input
              type="text"
              name="shemale"
              value={form.shemale}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Meet</label>
            <input
              type="text"
              name="meet"
              value={form.meet}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Live</label>
            <input
              type="text"
              name="live"
              value={form.live}
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

export default HeaderLinks;
