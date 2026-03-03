"use client";

import { useEffect, useState } from "react";
import TravellerInfo from "@/components/TravellerInfo/TravellerInfo";
import TravellersStories from "@/components/Profile/TravellersStories/TravellersStories";
import { Story } from "@/types/story";

interface ProfileStoriesProps {
  userId?: string;
  variant: "own" | "saved"; // визначаємо, яка вкладка активна
}

const ProfileStoriesClient = ({ userId = "temporary-id", variant }: ProfileStoriesProps) => {
  const activeTab = variant; // тепер вкладка приходить через проп

  const [savedStories, setSavedStories] = useState<Story[]>([]);
  const [ownStories, setOwnStories] = useState<Story[]>([]);
  const [pageSaved, setPageSaved] = useState(1);
  const [pageOwn, setPageOwn] = useState(1);
  const [totalPagesSaved, setTotalPagesSaved] = useState(1);
  const [totalPagesOwn, setTotalPagesOwn] = useState(1);
  const [isFetchingSaved, setIsFetchingSaved] = useState(false);
  const [isFetchingOwn, setIsFetchingOwn] = useState(false);

  // --- Префетч історій при монтуванні ---
  useEffect(() => {
    let mounted = true;

    const fetchSavedStories = async (page: number) => {
      setIsFetchingSaved(true);
      try {
        const res = await fetch(`/api/stories/saved?page=${page}`);
        const data = await res.json();
        if (!mounted) return;
        setSavedStories(prev => (page === 1 ? data.stories : [...prev, ...data.stories]));
        setTotalPagesSaved(data.totalPages);
      } catch (err) {
        console.error("Помилка завантаження збережених історій:", err);
      } finally {
        if (mounted) setIsFetchingSaved(false);
      }
    };

    const fetchOwnStories = async (page: number) => {
      setIsFetchingOwn(true);
      try {
        const res = await fetch(`/api/stories/own?page=${page}`);
        const data = await res.json();
        if (!mounted) return;
        setOwnStories(prev => (page === 1 ? data.stories : [...prev, ...data.stories]));
        setTotalPagesOwn(data.totalPages);
      } catch (err) {
        console.error("Помилка завантаження власних історій:", err);
      } finally {
        if (mounted) setIsFetchingOwn(false);
      }
    };

    // Завантажуємо обидві вкладки для кешу
    fetchSavedStories(1);
    fetchOwnStories(1);

    return () => {
      mounted = false;
    };
  }, []);

  // --- Хендлери кнопок "Load More" ---
  const loadMoreSaved = () => {
    const nextPage = pageSaved + 1;
    setPageSaved(nextPage);
    setIsFetchingSaved(true);
    fetch(`/api/stories/saved?page=${nextPage}`)
      .then(res => res.json())
      .then(data => setSavedStories(prev => [...prev, ...data.stories]))
      .catch(console.error)
      .finally(() => setIsFetchingSaved(false));
  };

  const loadMoreOwn = () => {
    const nextPage = pageOwn + 1;
    setPageOwn(nextPage);
    setIsFetchingOwn(true);
    fetch(`/api/stories/own?page=${nextPage}`)
      .then(res => res.json())
      .then(data => setOwnStories(prev => [...prev, ...data.stories]))
      .catch(console.error)
      .finally(() => setIsFetchingOwn(false));
  };

  return (
    <div>
      <TravellerInfo id={userId} />

      {activeTab === "own" ? (
        <TravellersStories
          stories={ownStories}
          variant="own"       // Додаємо variant
          editButton={true}   // кнопка редагування
          onLoadMore={loadMoreOwn}
          page={pageOwn}
          totalPages={totalPagesOwn}
          isFetching={isFetchingOwn}
        />
      ) : (
        <TravellersStories
          stories={savedStories}
          variant="saved"     // Додаємо variant
          editButton={false}  // кнопка збереження
          onLoadMore={loadMoreSaved}
          page={pageSaved}
          totalPages={totalPagesSaved}
          isFetching={isFetchingSaved}
        />
      )}
    </div>
  );
};

export default ProfileStoriesClient;