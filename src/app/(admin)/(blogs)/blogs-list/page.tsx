'use client';
import SearchBar from '@/components/common/SearchBar';
import SelectDropdown from '@/components/common/Select';
import Pagination from '@/components/tables/Pagination';
import baseApi from '@/utils/axiosIntance';
import { useEffect, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { toast } from 'react-toastify';
import categories from '../../../../../public/category.json';
import { RxCross2 } from 'react-icons/rx';
import BlogsTable from '@/components/tables/Blogs.table';

const Blogs = () => {
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [subCategoryOptions, setSubCategoryOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await baseApi.get(
          `/blogs?page=${pagination.page}&limit=${pagination.limit}&q=${search}&sortOrder=${sortOrder}&cat=${category}&subCat=${subcategory}`
        );
  
        setBlogs(res.data?.data || []);
        setPagination(res.data?.pagination || pagination);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        toast.error('Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [sortOrder, search, pagination.page, pagination.limit, category, subcategory, reload]);

  const handleSearchChange = (value: string) => {
    setPagination({ ...pagination, page: 1 });
    setSearch(value);
  };

  const handleSelect = (value: string) => {
    setPagination({ ...pagination, page: 1 });
    setSortOrder(value);
  };

  const options = [
    { label: 'Latest', value: 'desc' },
    { label: 'Oldest', value: 'asc' },
  ];

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
    setPagination({ ...pagination, page: 1 });
  };

  const categoryOptions = categories.map((cat: any) => ({
    label: cat.name,
    value: cat.slug,
  }));

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="mb-5 flex items-center gap-2 justify-end sm:flex-row flex-col">
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
          options={options}
          placeholder="Sort by"
          onSelect={handleSelect}
        />
              <div className='ml-2'>
                <RxCross2
                  onClick={handleReset}
                  title="Reset Filters"
                  className="w-5 h-5  rounded-full cursor-pointer bg-red-600 text-white ml-auto"
                />
              </div>
      </div>

      {loading ? (
        <p className="flex h-69 justify-center items-center gap-2">
          <AiOutlineLoading3Quarters className="animate-spin text-3xl text-white" />
     
        </p>
      ) : (
        <div>
        
           {blogs?.length ? (
                      <>
                       <BlogsTable blogs={blogs} setReload={setReload} reload={reload} />
          <Pagination
            page={pagination.page}
            limit={pagination.limit}
            total={pagination.total}
            onPageChange={(page) => setPagination({ ...pagination, page })}
            onLimitChange={(limit) => setPagination({ ...pagination, page: 1, limit })}
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

export default Blogs;
