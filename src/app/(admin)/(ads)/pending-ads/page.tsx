'use client';

import SearchBar from '@/components/common/SearchBar';
import SelectDropdown from '@/components/common/Select';
import Pagination from '@/components/tables/Pagination';
import PostsTable from '@/components/tables/Post.table';
import baseApi from '@/utils/axiosIntance';
import { dateoptions, options } from '@/utils/select-items';
import { useEffect, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { toast } from 'react-toastify';
import categories from '../../../../../public/category.json';
import { RxCross2 } from "react-icons/rx";
import ConfirmBulkDeleteModal from '@/components/modals/BulkDelete';
import ConfirmBulkApproveModal from '@/components/modals/BulkApproved';

const PendingPosts = () => {
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [subCategoryOptions, setSubCategoryOptions] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);


  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await baseApi.get(
          `/posts?isApproved=false&page=${pagination.page}&limit=${pagination.limit}&q=${search}&sortOrder=${sortOrder}&date=${date}&cat=${category}&subCat=${subcategory}`
        );
        setPosts(res.data?.data || []);
        setPagination(res.data?.pagination || pagination);
      } catch (err) {
        console.error('Error fetching posts:', err);
        toast.error('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [sortOrder, search, pagination.page, pagination.limit, date, category, subcategory, reload]);

  const handleSearchChange = (value: string) => {
    setPagination({ ...pagination, page: 1 });
    setSearch(value);
  };

  const handleSelect = (value: string) => {
    setPagination({ ...pagination, page: 1 });
    setSortOrder(value);
  };

  const handleDateSelect = (value: string) => {
    setPagination({ ...pagination, page: 1 });
    setDate(value);
  };

  const handleCategorySelect = (value: string) => {
    setPagination({ ...pagination, page: 1 });
    setCategory(value);
    setSubcategory('');
    const selectedCat = categories.find((cat: any) => cat.slug === value);
    if (selectedCat && Array.isArray(selectedCat.subcategories)) {
      const subOptions = selectedCat.subcategories.map((sub: any) => ({
        label: sub.name,
        value: sub.slug,
      }));
      setSubCategoryOptions(subOptions);
    } else {
      setSubCategoryOptions([]);
    }
  };

  const handleSubCategorySelect = (value: string) => {
    setPagination({ ...pagination, page: 1 });
    setSubcategory(value);
  };

  const handleReset = () => {
    setCategory('');
    setSubcategory('');
    setSubCategoryOptions([]);
    setSearch('');
    setSortOrder('');
    setDate('');
    setPagination({ ...pagination, page: 1 });
  };

  const categoryOptions = categories.map((cat: any) => ({
    label: cat.name,
    value: cat.slug,
  }));

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      {selectedIds?.length > 0  ? <div className="mb-5 flex flex-row gap-2 sm:justify-end justify-center items-center">
       <ConfirmBulkDeleteModal reload={reload} setReload={setReload} selectedIds={selectedIds} />
       <ConfirmBulkApproveModal reload={reload} setReload={setReload} selectedIds={selectedIds} isApproved={true} />
       </div> :   <div className="mb-5 flex flex-row gap-2 sm:justify-end justify-center items-center">

        <SearchBar onChange={handleSearchChange} />

        <SelectDropdown
          options={categoryOptions}
          placeholder="Select Category"
          onSelect={handleCategorySelect}
          value={category || ''} // ✅ controlled value
        />

        <SelectDropdown
          disabled={!category || subCategoryOptions.length < 1}
          options={subCategoryOptions}
          placeholder="Select Subcategory"
          onSelect={handleSubCategorySelect}
          value={subcategory || ''} // ✅ controlled value
        />

        <SelectDropdown
          options={dateoptions}
          placeholder="Select Date Filter"
          onSelect={handleDateSelect}
          value={date || ''} // ✅ controlled value
        />

        <SelectDropdown
          options={options}
          placeholder="Choose Sort"
          onSelect={handleSelect}
          value={sortOrder || ''} 
        />
  <div className='ml-2'>
        <RxCross2
          onClick={handleReset}
          title="Reset Filters"
          className="w-5 h-5 rounded-full cursor-pointer bg-red-600 text-white ml-auto"
        />
        </div>
      
      </div>}
    

      {loading ? (
        <p className="flex h-69 justify-center items-center gap-2">
          <AiOutlineLoading3Quarters className="animate-spin text-3xl text-white" />
        </p>
      ) : (
        <div>
          {posts?.length ? (
            <>
              <PostsTable posts={posts} setReload={setReload} reload={reload} admin={true} selectedIds={selectedIds} setSelectedIds={setSelectedIds} />
              <Pagination
                page={pagination.page}
                limit={pagination.limit}
                total={pagination.total}
                onPageChange={(e) => setPagination({ ...pagination, page: e })}
                onLimitChange={(e) => setPagination({ ...pagination, page: 1, limit: e })}
              />
            </>
          ) : (
            <p className="flex h-69 justify-center items-center text-red-700">
              No Data Found
            </p>
          )}
        </div>
      )}
      
    </div>
  );
};

export default PendingPosts;
