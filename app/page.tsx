import BookmarkList from "@/components/bookmarksList";
import DateTimeDisplay from "@/components/DateTimeDisplay";

export default function Home() {
  const data = [
    {
      category: "Programming",
      links: [
        {
          name: "GitHub",
          icon: "https://github.com/fluidicon.png",
          site: "github.com"
        },
        {
          name: "Google",
          icon: "https://www.gstatic.com/images/branding/product/1x/googleg_standard_color_128dp.png",
          site: "google.com"
        },
        {
          name: "Hacker News",
          icon: "https://news.ycombinator.com/y18.svg",
          site: "news.ycombinator.com/"
        },
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      {/* Date & Time Display */}
      <DateTimeDisplay />

      {/* Content - Centrado vertical y horizontalmente */}
      <div className="flex-1 flex items-center justify-center">
        <BookmarkList data={data} />
      </div>
    </main>
  );
}
