import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import React, { useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectDropdownProps {
  options: Option[];
  placeholder?: string;
  onSelect: (value: string) => void;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  options,
  placeholder = "Select...",
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const handleSelect = (option: Option) => {
    setSelected(option);
    onSelect(option.value);
    closeDropdown();
  };

  return (
    <div className="relative inline-block sm:w-40 w-10/12">
      <button
        onClick={toggleDropdown}
        className="dropdown-toggle dark:bg-dark-900 h-11 rounded-lg border border-gray-200 bg-transparent py-2.5  text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 sm:w-40  w-full"
      >
        <span>{selected ? selected.label : placeholder}</span>
     
      </button>

      <Dropdown isOpen={isOpen} onClose={closeDropdown} className="sm:w-40 w-full text-center p-2">
        {options.map((option) => (
          <DropdownItem
            key={option.value}
            onItemClick={() => handleSelect(option)}
            className="flex w-full text-center dark:bg-dark-700 font-normal text-left dark:text-gray-300 dark:hover:bg-gray-900 rounded-lg"
          >
            {option.label}
          </DropdownItem>
        ))}
      </Dropdown>
    </div>
  );
};

export default SelectDropdown;
