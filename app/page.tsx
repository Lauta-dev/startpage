import BookmarkList from "@/components/bookmarksList";
import DateTimeDisplay from "@/components/DateTimeDisplay";
import ListaUsuarios from "@/components/tt";

export default async function Home() {
  const res = await fetch('http://localhost:3000/api/bookmark'); // Ruta relativa
  const data = await res.json();
  
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
