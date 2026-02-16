import Aaa from "@/actions/getBookmark";
import BookmarkList from "@/components/bookmarksList";
import DateTimeDisplay from "@/components/DateTimeDisplay";

export default async function Home() {
  const data = await Aaa()
  
  return (
     <main className="min-h-screen bg-gray-50 dark:bg-black flex flex-col transition-colors">
      {/* Date & Time Display */}
      <DateTimeDisplay />

      {/* Content - Centrado vertical y horizontalmente */}
      <div className="flex-1 flex items-center justify-center">
        <BookmarkList data={data} />
      </div>
    </main>
  );
}
