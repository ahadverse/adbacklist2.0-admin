"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import baseApi from "@/utils/axiosIntance";
import { toast } from "react-toastify";
import { BsTrash } from "react-icons/bs";

interface ConfirmDeleteModalProps {
    id: string | null;
    route: string;
    reload: boolean;
    setReload: (value: boolean) => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    id,
    route,
    reload,
    setReload,
}) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onClose = () => setOpen(false)

    const handleDelete = async () => {
        if (!id) return;
        setLoading(true);
        try {
            await baseApi.delete(`${route}/${id}`);
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

            <button title="Delete" onClick={() => setOpen(true)} className="text-white text-sm px-2 rounded-full">
                <BsTrash />
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
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default ConfirmDeleteModal;
