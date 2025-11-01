"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import baseApi from "@/utils/axiosIntance";
import { toast } from "react-toastify";
import { BsTrash } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface ConfirmDeleteModalProps {
    selectedIds: string[];
    reload: boolean;
    setReload: (value: boolean) => void;
}

const ConfirmBulkDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    selectedIds,
    reload,
    setReload,
}) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onClose = () => setOpen(false)

    const handleDelete = async () => {
        if (!selectedIds?.length) return;
        setLoading(true);
        try {
            await baseApi.put("/posts/bulk-delete", { ids: selectedIds });
            toast.success("Deleted successfully.");
            setReload(!reload);
            onClose();
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>

            <button title="Delete" onClick={() => setOpen(true)} className="ddark:bg-dark-900 h-11 rounded-lg border border-gray-200 bg-transparent py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 sm:w-40 w-full flex items-center justify-center gap-2">
                 <BsTrash className="text-red-500" />  Bulk Delete
            </button>

            <Modal
                isOpen={open}
                onClose={onClose}
                className="max-w-[400px] p-6 text-center"
            >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Confirm Delete
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this item? This action cannot be undone.
                </p>

                <div className="flex justify-center gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="w-34  px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >

                        {loading ? (
                            <AiOutlineLoading3Quarters className="animate-spin text-xl m-auto text-white" />
                        ) : (
                            "Delete Selected"
                        )}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default ConfirmBulkDeleteModal;
