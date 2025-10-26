"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import baseApi from "@/utils/axiosIntance";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaHandHoldingDollar } from "react-icons/fa6";


interface UpdateCreditModalProps {
  id: string | null;
  reload: boolean;
  setReload: (value: boolean) => void;
}

const UpdateCreditModal: React.FC<UpdateCreditModalProps> = ({
  id,
  reload,
  setReload,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credit, setCredit] = useState<number>(0);

  const onClose = () => setOpen(false);

  const handleUpdateCredit = async () => {
    if (!id) return;
        setLoading(true);
    if (credit < 0) {
      toast.error("Credit must be a positive number");
         setLoading(false);
      return;
    }
    if (credit < 1) {
      toast.error("Minimum amount is 1");
         setLoading(false);
      return;
    }


    try {
      await baseApi.put(`/transaction/credit/${id}`, { credit ,  status : 'success', creditGiven : 'true'});
      toast.success("User credit updated successfully!");
      setReload(!reload);
      setLoading(false);
      onClose();
    } catch (err: any) {
        setLoading(false);
      console.error(err);
      toast.error(err.message || "Something went wrong!");
    }
  };

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="dark:text-white text-sm px-2 rounded-full"
      >
        <FaHandHoldingDollar />
      </button>

      <Modal
        isOpen={open}
        onClose={onClose}
        className="max-w-[400px] p-6 text-center"
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Give User Credit
        </h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Enter credit amount for this user. It will adjust user current credit
        </p>

        <input
          type="number"
          value={credit}
          onChange={(e) => setCredit(parseFloat(e.target.value))}
          className="mt-4 w-full px-3 py-2 border rounded-lg text-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Enter credit amount"
          
        />

        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateCredit}
            disabled={loading}
            className="w-28 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin text-xl m-auto text-white" />
            ) : (
              "Give Credit"
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UpdateCreditModal;
