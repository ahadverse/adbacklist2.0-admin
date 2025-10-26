"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import baseApi from "@/utils/axiosIntance";
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


interface ConfirmApproveModalProps {
    id: string | null;
    route: string;
    reload: boolean;
    isApproved: boolean;
    setReload: (value: boolean) => void;
}

const ConfirmApproveModal: React.FC<ConfirmApproveModalProps> = ({
    id,
    route,
    reload,
    isApproved,
    setReload,
}) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onClose = () => setOpen(false)

    const handleApprove = async () => {
        if (!id) return;
        setLoading(true);
        try {
            await baseApi.put(`${route}/approved/${id}`, {isApproved});
            toast.success("Approved successfully.");
              setLoading(false);
            setReload(!reload);
            onClose();
        } catch (err: any) {
              setLoading(false);
            console.error(err);
            toast.error(err.message || "Something went wrong!");
        }
    };

    return (
        <div>

            <button title="Approve" onClick={() => setOpen(true)} className={`${isApproved ? 'text-green-500' : 'text-red-600'} text-sm px-2 rounded-full`}>
                <FaCheckCircle  />
            </button>

            <Modal
                isOpen={open}
                onClose={onClose}
                className="max-w-[400px] p-6 text-center"
            >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Confirm  {isApproved ? 'Approve' : 'Disapprove'}
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Are you sure you want to Approve this item?
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
                        className="w-28 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? <AiOutlineLoading3Quarters className="animate-spin text-xl m-auto text-white" /> : <> {isApproved ? 'Approve' : 'Disapprove'}</>}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default ConfirmApproveModal;
