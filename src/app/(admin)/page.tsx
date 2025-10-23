"use client"
import { DashboardStats, EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { useEffect, useState } from "react";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import { toast } from "react-toastify";
import Head from "next/head";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import baseApi from "@/utils/axiosIntance";



export default function Ecommerce() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await baseApi.get("/alldata");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="">
         <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content="Admin panel overview" />
      </Head>
      {
        loading ?       
        <p className="flex h-69 justify-center items-center gap-2">
                  <AiOutlineLoading3Quarters className="animate-spin text-3xl text-white" />
               </p> : <>
                <div className="mb-5">
        <EcommerceMetrics stats={stats as DashboardStats} />
      </div>
         <MonthlySalesChart stats={stats}  /></>
      }
     
    </div>
  );
}
