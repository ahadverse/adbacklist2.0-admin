"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import baseApi from "@/utils/axiosIntance";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const UploadImageModal = () => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onClose = () => {
    setOpen(false);
    setImage(null);
    setPreview(null);
    setUploadedUrl(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setUploadedUrl(null); // clear old uploaded url if re-selecting
  };

  const handleUpload = async () => {
    if (!image) return toast.error("Select an image first");
    setLoading(true);

    const formData = new FormData();
    formData.append("images", image);

    try {
      const res = await baseApi.post("/files2/files", formData);
      setUploadedUrl(res.data?.[0]);
      toast.success("Uploaded Successfully!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    if (!uploadedUrl) return;
    navigator.clipboard.writeText(uploadedUrl);
    toast.success("Copied!");
  };

  return (
    <div>
      {/* Button to open modal */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Upload Image
      </button>

      {/* Modal */}
      <Modal isOpen={open} onClose={onClose} className="max-w-[420px] p-6">
        <h3 className="text-lg font-semibold text-center mb-4 text-gray-800 dark:text-white">
          Upload Image
        </h3>

        {/* File select */}
        <label className="block border border-dashed border-gray-400 p-4 rounded-md text-center hover:border-red-500 cursor-pointer">
          Select Image
          <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </label>

        {/* Preview */}
        {preview && (
          <div className="mt-4">
            <img src={preview} className="w-fit max-h-[250px] m-auto  rounded-md" />
          </div>
        )}


        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded-md dark:border-gray-700 dark:text-white"
          >
            Close
          </button>

          
     {uploadedUrl ?  (
         
            <button onClick={copy}    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2">
              Copy
            </button>
     
        ) : <button
            onClick={handleUpload}
            disabled={loading || !image}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              "Upload"
            )}
          </button>}

        </div>
      </Modal>
    </div>
  );
};

export default UploadImageModal;
