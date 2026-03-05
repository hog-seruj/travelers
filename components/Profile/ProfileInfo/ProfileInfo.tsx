"use client";

import Image from "next/image";
import css from "./ProfileInfo.module.css";
import { useAuthStore } from "@/lib/store/authStore";
import { getMe } from "@/lib/api/clientApi";
import { useEffect, useState } from "react";
import Loader from '@/components/Loader/Loader';
import { toast } from 'sonner';

export default function ProfileInfo() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    let mounted = true; 

    const fetchUser = async () => {
      if (!user) {
        try {
          const data = await getMe();
          if (mounted) {
            setUser(data); 
          }
        } catch (err) {
          console.error("Помилка завантаження профілю:", err);
        } finally {
          if (mounted) {
            setLoading(false); 
          }
        }
      } else {
        
        setLoading(false);
      }
    };

    fetchUser();

    return () => {
      mounted = false; 
    };
  }, [user, setUser]);

  if (loading) return <Loader />;
if (!user) {
  toast.error('Користувача не знайдено');
  return null; // нічого не рендеримо
}
  const { avatarUrl, description, name } = user;

  return (
    <div className={css.wrapper}>
      <Image
        src={avatarUrl}
        alt={name}
        className={css.avatar}
        width={199}
        height={199}
      />
      <div className={css.content}>
        <h2 className={css.name}>{name}</h2>
        <p className={css.description}>{description}</p>
      </div>
    </div>
  );
}