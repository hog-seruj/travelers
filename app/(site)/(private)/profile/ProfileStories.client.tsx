"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TravellerInfo from "@/components/TravellerInfo/TravellerInfo";
import TravellersStories from "@/components/TravellersStories/TravellersStories";
import PageToggle from "@/components/PageToggle/PageToggle";
import { StoryListResponse } from "@/types/story";
import { getSavedStories, getOwnStories } from "@/lib/api/stories";

interface ProfileStoriesProps {
  userId?: string;
  variant: "own" | "saved";
}

const ProfileStoriesClient = ({ userId = "temporary-id", variant }: ProfileStoriesProps) => {
  const [activeTab, setActiveTab] = useState<"own" | "saved">(variant);
  const [pageSaved, setPageSaved] = useState(1);
  const [pageOwn, setPageOwn] = useState(1);

  // --- Запити через React Query 5 ---
  const {
    data: savedData,
    isLoading: isLoadingSaved,
    refetch: refetchSaved,
  } = useQuery<StoryListResponse>({
    queryKey: ["savedStories", pageSaved],
    queryFn: () => getSavedStories(pageSaved),
  });

  const {
    data: ownData,
    isLoading: isLoadingOwn,
    refetch: refetchOwn,
  } = useQuery<StoryListResponse>({
    queryKey: ["ownStories", pageOwn],
    queryFn: () => getOwnStories(pageOwn),
  });

  const loadMoreSaved = () => {
    setPageSaved(prev => prev + 1);
    refetchSaved();
  };

  const loadMoreOwn = () => {
    setPageOwn(prev => prev + 1);
    refetchOwn();
  };

  return (
    <div>
      <TravellerInfo id={userId} />

      <PageToggle activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "own" ? (
        <TravellersStories
          stories={ownData?.stories || []}
          variant="own"
          editButton={true}
          onLoadMore={loadMoreOwn}
          page={pageOwn}
          totalPages={ownData?.totalPages || 1}
          isFetching={isLoadingOwn}
        />
      ) : (
        <TravellersStories
          stories={savedData?.stories || []}
          variant="saved"
          editButton={false}
          onLoadMore={loadMoreSaved}
          page={pageSaved}
          totalPages={savedData?.totalPages || 1}
          isFetching={isLoadingSaved}
        />
      )}
    </div>
  );
};

export default ProfileStoriesClient;