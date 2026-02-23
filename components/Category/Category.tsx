'use client';

import { useState, useRef, useEffect } from "react";
import {Category} from '@/types/story';
import Icon from '../Icon/Icon';
import css from './Category.module.css';


interface CategoryProps {
  categories: Category[];
  value:string;
  onChange:(categoryId:string)=>void;
};


export default function CategorySelect ({categories, value, onChange}: CategoryProps){
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const allCategories=[{_id: 'all', name: 'Всі категорії'}, ...categories];
   
    const selectedOption = allCategories.find((option) => option._id === value) || allCategories[0];

    useEffect(() => {
        const handleClickOutside=(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect=(categoryId:string)=>{
        onChange(categoryId);
        setIsOpen(false);
    };
    
    return(
        <>
        <label className={css.label} htmlFor="categorySelect">Категорії</label>
        <div className={css.categoryContainer} ref={dropdownRef}>
            <div className={`${css.selectCategory} ${isOpen ? css.selectOpen : ''}`}
            onClick={()=>setIsOpen(!isOpen)}>
                <span className={css.selectText}>{selectedOption.name}</span>
                <Icon name={isOpen ? 'icon-up' : 'icon-down'} className={css.arrowIcon} />
            </div>

            {isOpen && (
                <div className={css.dropdown}>
                    {allCategories.map(option=>(
                        <div key={option._id} className={`${css.dropdownItem} ${value===option._id ? css.dropdownItemSelected : ''}`}
                        onClick={() => handleSelect(option._id)}>
                            {option.name}
                        </div>
                    ))}
                </div>
                    )}
                    </div>
                    <div className={css.buttonsWrapper}>
                        <button className={`${css.categoryBtn} ${value==="all" ? css.active : ''}`}
                        onClick={()=>onChange('all')}>Всі історії</button>

                        {categories.map((category)=>(
                            <button key={category._id}
                            className={`${css.categoryBtn} ${value===category._id ? css.active : ''}`}
                            onClick={()=>onChange(category._id)}>
                                {category.name}</button>
                        ))}
                    </div>
        </>
    );
}