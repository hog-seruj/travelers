import {getStories, getCategories} from "@/lib/api/serverApi";
import {dehydrate, HydrationBoundary, QueryClient,} from "@tanstack/react-query";
import StoriesPageClient from "./StoriesPageClient";


export default async function StoriesPage() {
const queryClient = new QueryClient();

const initialStories = await getStories(1, 9);
const categories = await getCategories();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StoriesPageClient 
          initialStories={initialStories}
          categories={categories} />
    </HydrationBoundary>
     
  );
}

