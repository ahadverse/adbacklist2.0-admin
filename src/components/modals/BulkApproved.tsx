"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import baseApi from "@/utils/axiosIntance";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";

interface ConfirmBulkApproveModalProps {
    selectedIds: string[];
    reload: boolean;
    setReload: (value: boolean) => void;
    isApproved?: boolean; // optional if you want to toggle approve/unapprove
}

const ConfirmBulkApproveModal: React.FC<ConfirmBulkApproveModalProps> = ({
    selectedIds,
    reload,
    setReload,
    isApproved = true, 
}) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onClose = () => setOpen(false);

    const handleApprove = async () => {
        if (!selectedIds?.length) return;
        setLoading(true);
        try {
            await baseApi.put("/posts/bulk-approve", {
                ids: selectedIds,
                isApproved,
            });
            toast.success(
                isApproved
                    ? "Posts approved successfully."
                    : "Posts unapproved successfully."
            );
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
            <button
                title={isApproved ? "Approve Selected" : "Unapprove Selected"}
                onClick={() => setOpen(true)}
                disabled={!selectedIds?.length}
                className={`h-11 rounded-lg border border-gray-200 bg-transparent py-2.5 text-sm  shadow-theme-xs 
                 hover:bg-gray-50 
                dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] 
                disabled:opacity-50 sm:w-40 w-full  text-gray-800 dark:text-white/90 flex items-center justify-center gap-2`}
            >
                 <FaCheckCircle className={` ${isApproved ? 'text-green-500' : 'text-red-600'}`}  /> {isApproved ? "Bulk Approve" : "Bulk Disapprove"}
            </button>

            <Modal
                isOpen={open}
                onClose={onClose}
                className="max-w-[400px] p-6 text-center"
            >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {isApproved ? "Confirm Approve" : "Confirm Unapprove"}
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Are you sure you want to{" "}
                    {isApproved ? "approve" : "unapprove"} these posts?
                </p>

                <div className="flex justify-center gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApprove}
                        disabled={loading}
                        className="w-34 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? (
                            <AiOutlineLoading3Quarters className="animate-spin text-xl m-auto text-white" />
                        ) : (
                            isApproved ? "Approve" : "Disapprove"
                        )}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default ConfirmBulkApproveModal;
