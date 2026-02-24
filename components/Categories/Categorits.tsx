'use client';

import { useState, useRef, useEffect } from "react";
import { Category } from "@/types/story";
import css from "./Category.module.css";
import  Icon  from "../Icon/Icon";

interface Props {
  categories: Category[];
  value: string;
  onChange: (categoryId: string) => void;
}

export default function Categories({ categories, value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const allCategories = [{ _id: 'all', name: 'Всі історії' },...categories];

  const selectedCategory = allCategories.find(selest => selest._id === value) || allCategories[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (categoryId: string) => {
    onChange(categoryId);
    setIsOpen(false);
  };

  return (
    <>
         <label htmlFor="categorySelect" className={css.labelCategories}>
          Категорії
        </label>
    <div className={css.selectContainer} ref={wrapperRef}>
      <div 
        className={`${css.select} ${isOpen ? css.selectOpen : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={css.categoryText}>{selectedCategory.name}</span>
        <Icon 
          name={isOpen ? "icon-up" : "icon-down"} 
          className={css.selectIcon} 
        />
      </div>
      
      {isOpen && (
        <div className={css.dropdown}>
          {allCategories.map(option => (
            <div
              key={option._id}
              className={`${css.dropdownItem} ${value === option._id ? css.dropdownItemSelected : ''}`}
              onClick={() => handleSelect(option._id)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
    <div className={css.buttonsWrapper}>
      <button
        className={`${css.categoryBtn} ${value === "all" ? css.active : ""}`}
        onClick={() => onChange("all")}
           >
        Всі історії
      </button>

      {categories.map((cat) => (
        <button
          key={cat._id}
          className={`${css.categoryBtn} ${value === cat._id ? css.active : ""}`}
          onClick={() => onChange(cat._id)}
        >
          {cat.name}
        </button>
      ))}
         </div>
      </>
  );
}