"use client";

import { useEffect, useState } from "react";
import TravellerInfo from "@/components/TravellerInfo/TravellerInfo";
import TravellersStories from "@/components/TravellersStories/TravellersStories";
import PageToggle from "@/components/PageToggle/PageToggle"; // імпортуємо PageToggle
import { Story } from "@/types/story";

interface ProfileStoriesProps {
  userId?: string;
  variant: "own" | "saved"; // початкова вкладка
}

const ProfileStoriesClient = ({ userId = "temporary-id", variant }: ProfileStoriesProps) => {
  // тепер activeTab керується локальним станом
  const [activeTab, setActiveTab] = useState<"own" | "saved">(variant);

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

    const fetchStories = async (type: "saved" | "own", page: number) => {
      const setStories = type === "saved" ? setSavedStories : setOwnStories;
      const setTotalPages = type === "saved" ? setTotalPagesSaved : setTotalPagesOwn;
      const setFetching = type === "saved" ? setIsFetchingSaved : setIsFetchingOwn;

      setFetching(true);
      try {
        const res = await fetch(`/api/stories/${type}?page=${page}`);
        const data = await res.json();
        if (!mounted) return;
        setStories(prev => (page === 1 ? data.stories : [...prev, ...data.stories]));
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error(`Помилка завантаження ${type} історій:`, err);
      } finally {
        if (mounted) setFetching(false);
      }
    };

    fetchStories("saved", 1);
    fetchStories("own", 1);

    return () => {
      mounted = false;
    };
  }, []);

  const loadMore = (type: "saved" | "own") => {
    const nextPage = type === "saved" ? pageSaved + 1 : pageOwn + 1;
    if (type === "saved") setPageSaved(nextPage);
    else setPageOwn(nextPage);

    const setFetching = type === "saved" ? setIsFetchingSaved : setIsFetchingOwn;
    const setStories = type === "saved" ? setSavedStories : setOwnStories;

    setFetching(true);
    fetch(`/api/stories/${type}?page=${nextPage}`)
      .then(res => res.json())
      .then(data => setStories(prev => [...prev, ...data.stories]))
      .catch(console.error)
      .finally(() => setFetching(false));
  };

  return (
    <div>
      <TravellerInfo id={userId} />

      {/* PageToggle для перемикання вкладок */}
      <PageToggle activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "own" ? (
        <TravellersStories
          stories={ownStories}
          variant="own"
          editButton={true}
          onLoadMore={() => loadMore("own")}
          page={pageOwn}
          totalPages={totalPagesOwn}
          isFetching={isFetchingOwn}
        />
      ) : (
        <TravellersStories
          stories={savedStories}
          variant="saved"
          editButton={false}
          onLoadMore={() => loadMore("saved")}
          page={pageSaved}
          totalPages={totalPagesSaved}
          isFetching={isFetchingSaved}
        />
      )}
    </div>
  );
};

export default ProfileStoriesClient;