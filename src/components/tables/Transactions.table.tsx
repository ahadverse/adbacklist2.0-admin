"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";


export interface Transaction {
  _id: string;
  status: string;
  trxId: string;
  currency: string;
  email: string;
  amount: number;
  exactAmount: number;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    avater: string;
    role: string;
    email: string;
  };
  creditGiven: string;
  createdAt: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1002px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                  User
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                  Email
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                  Transaction ID
                </TableCell>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                  Amount
                </TableCell>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                  Currency
                </TableCell>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                  Status
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                  Credit Given
                </TableCell>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                  Created At
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {transactions.map((trx) => (
                <TableRow key={trx._id}>
                  {/* User */}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                    
                      <div>
                        <span className="block capitalize font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {trx.userId.firstName} {trx.userId.lastName}
                        </span>
                  
                      </div>
                    </div>
                  </TableCell>

                  {/* Email */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {trx.email}
                  </TableCell>

                  {/* Transaction ID */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {trx.trxId}
                  </TableCell>

                  {/* Amount */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {trx.amount}
                  </TableCell>

                  {/* Currency */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {trx.currency}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        trx.status === "success"
                          ? "success"
                          : trx.status === "pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {trx.status}
                    </Badge>
                  </TableCell>

                  {/* Credit Given */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {trx.creditGiven}
                  </TableCell>

                  {/* Created At */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {new Date(trx.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
