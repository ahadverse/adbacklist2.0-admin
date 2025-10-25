"use client"
import Pagination from "@/components/tables/Pagination";
import PostsTable from "@/components/tables/Post.table";
import TransactionTable from "@/components/tables/Transactions.table";
import { User } from "@/components/tables/Users.table";
import baseApi from "@/utils/axiosIntance";
import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const UserDetails = () => {
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [transactions, setTransactions] = useState([]);
     const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 })
    const [activeTab, setActiveTab] = useState<"profile" | "posts" | "transactions">("profile");

    useEffect(() => {
        if (!id) return;
        const fetchUser = async () => {
            try {
                const res = await baseApi.get(`/users/${id}`);
                setUser(res.data?.data?.user);
            } catch (err) {
                console.error("Failed to load user:", err);
            } finally {
                setLoading(false);
            }
        };
        const fetchUserPosts = async () => {
            try {
                const res = await baseApi.get(`/posts/posterid/${id}`);
          
                      setPosts(res.data.data?.posts)
                setPagination(res.data?.pagination);
            } catch (err) {
                console.error("Failed to load user:", err);
            } finally {
                setLoading(false);
            }
        };
        const fetchUserTransactions = async () => {
            try {
                const res = await baseApi.get(`/transaction/user?id=${id}`);
                setTransactions(res.data.data)
                setPagination(res.data?.pagination);
            } catch (err) {
                console.error("Failed to load user:", err);
            } finally {
                setLoading(false);
            }
        };
        if (activeTab === 'profile') {
            setLoading(true);
            fetchUser();
        } else if (activeTab === 'posts') {
            setLoading(true);
            fetchUserPosts();
        } else {
            setLoading(true);
            fetchUserTransactions();
        }



    }, [id, activeTab, pagination?.page, pagination?.limit]);



    if (!user && !loading) {
        return (
            <div className="p-6 text-red-500 dark:text-red-400">
                User not found or an error occurred.
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Navigation Tabs */}
            <div className="flex gap-8 border-b border-gray-300 mb-4">
                <button
                    className={`pb-2 ${activeTab === "profile" ? "border-b-2 border-blue-500 text-orange-600 font-semibold" : "dark:text-gray-300 text-gray-800"}`}
                    onClick={() => {
                        setLoading(true)
                         setActiveTab("profile")
                    }}
                >
                    Profile
                </button>
                <button
                    className={`pb-2 ${activeTab === "posts" ? "border-b-2 border-blue-500  text-orange-600 font-semibold" : "dark:text-gray-300 text-gray-800"}`}
             
                             onClick={() => {
                        setLoading(true)
                         setActiveTab("posts")
                    }}
                >
                    Posts
                </button>
                <button
                    className={`pb-2 ${activeTab === "transactions" ? "border-b-2  text-orange-600 border-blue-500 font-semibold" : "dark:text-gray-300 text-gray-800"}`}
     
                                     onClick={() => {
                        setLoading(true)
                         setActiveTab("transactions")}}
                >
                    Transactions
                </button>
            </div>
 {
  loading ? 
            <p className="flex h-69 justify-center items-center gap-2">
                <AiOutlineLoading3Quarters className="animate-spin text-3xl text-white" />
            </p> :  <div>
                {activeTab === "profile" && (
                    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 p-6">

                        <div className="flex items-center space-x-4 mb-6">

                            <div className="w-26 h-26 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                                {user?.avater ? <img className="w-26 h-26 rounded-full" src={user?.avater} /> : <>     {user.firstName[0]}
                                    {user.lastName[0]}</>}

                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                                    {user.firstName} {user.lastName}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-300 font-medium">Credit:</span>
                                <span className="text-gray-800 dark:text-gray-100 font-semibold">${user.credit}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-300 font-medium">Joined At :</span>
                                <span className="text-gray-800 dark:text-gray-100 font-semibold">{new Date(user?.createdAt).toDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-300 font-medium">Role:</span>
                                <span className="text-gray-800 dark:text-gray-100 font-semibold">{user.role}</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "posts" && (
                    <div>
                        {posts?.length ? <><PostsTable posts={posts} />
                                <Pagination page={pagination?.page}
                                  limit={pagination?.limit}
                                  total={pagination?.total}
                                  onPageChange={e => setPagination({ ...pagination, page: e })} onLimitChange={e => setPagination({ ...pagination, limit: e })} /> </>: <p className="flex h-69 justify-center items-center text-red-700">No Data Found</p> }
                    </div>
                )}

                {activeTab === "transactions" && (
                    <div>
                        {transactions?.length ? <> <TransactionTable transactions={transactions} />
                           <Pagination page={pagination?.page}
                                  limit={pagination?.limit}
                                  total={pagination?.total}
                                  onPageChange={e => setPagination({ ...pagination, page: e })} onLimitChange={e => setPagination({ ...pagination, limit: e })} /></> : <p className="flex h-69 justify-center items-center text-red-700">No Data Found</p>}
                       
                    </div>
                )}
            </div>
        
    }

           
        </div>
    );
};

export default UserDetails;
