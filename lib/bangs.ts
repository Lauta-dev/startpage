interface Bangs {
  name: string,
  url:  string,
}

export const bangs: Record<string, Bangs> = {
  // --- BUSCADORES e IA ---
  "!g": { name: "Google", url: "https://www.google.com/search?q=[[user]]" },
  "!google": { name: "Google", url: "https://www.google.com/search?q=[[user]]" },
  "!ddg": { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=[[user]]" },
  "!b": { name: "Bing", url: "https://www.bing.com/search?q=[[user]]" },
  "!bing": { name: "Bing", url: "https://www.bing.com/search?q=[[user]]" },
  "!gpt": { name: "ChatGPT", url: "https://chatgpt.com/?q=[[user]]" },
  "!pplx": { name: "Perplexity", url: "https://www.perplexity.ai/?q=[[user]]" },
  "!ecosia": { name: "Ecosia", url: "https://www.ecosia.org/search?q=[[user]]" },

  // --- REDES SOCIALES ---
  "!f": { name: "Facebook", url: "https://www.facebook.com/search/top/?q=[[user]]" },
  "!facebook": { name: "Facebook", url: "https://www.facebook.com/search/top/?q=[[user]]" },
  "!x": { name: "Twitter / X", url: "https://twitter.com/search?q=[[user]]" },
  "!twitter": { name: "Twitter / X", url: "https://twitter.com/search?q=[[user]]" },
  "!ig": { name: "Instagram", url: "https://www.instagram.com/explore/tags/[[user]]/" },
  "!instagram": { name: "Instagram", url: "https://www.instagram.com/explore/tags/[[user]]/" },
  "!r": { name: "Reddit", url: "https://www.reddit.com/search/?q=[[user]]" },
  "!reddit": { name: "Reddit", url: "https://www.reddit.com/search/?q=[[user]]" },
  "!twch": { name: "Twitch", url: "https://www.twitch.tv/search?term=[[user]]" },
  "!twitch": { name: "Twitch", url: "https://www.twitch.tv/search?term=[[user]]" },

  // --- VIDEO & MULTIMEDIA ---
  "!yt": { name: "YouTube", url: "https://www.youtube.com/results?search_query=[[user]]" },
  "!youtube": { name: "YouTube", url: "https://www.youtube.com/results?search_query=[[user]]" },
  "!spotify": { name: "Spotify", url: "https://open.spotify.com/search/[[user]]" },

  // --- DESARROLLO (DOCUMENTACIÓN Y DOCS) ---
  "!js": { name: "MDN JavaScript", url: "https://developer.mozilla.org/search?q=[[user]]" },
  "!mdn": { name: "MDN Web Docs", url: "https://developer.mozilla.org/search?q=[[user]]" },
  "!ts": { name: "TypeScript Docs", url: "https://www.typescriptlang.org/search?q=[[user]]" },
  "!py": { name: "Python Docs", url: "https://docs.python.org/3/search.html?q=[[user]]" },
  "!rust": { name: "Rust Docs", url: "https://doc.rust-lang.org/std/?search=[[user]]" },
  "!go": { name: "Go Docs", url: "https://pkg.go.dev/search?q=[[user]]" },
  "!react": { name: "React Docs", url: "https://react.dev/search?q=[[user]]" },
  "!next": { name: "Next.js Docs", url: "https://nextjs.org/docs/search?query=[[user]]" },
  "!vue": { name: "Vue.js Docs", url: "https://vuejs.org/search.html?q=[[user]]" },
  "!tw": { name: "Tailwind CSS", url: "https://tailwindcss.com/docs/[[user]]" },
  "!tailwind": { name: "Tailwind CSS", url: "https://tailwindcss.com/docs/[[user]]" },
  "!bs": { name: "Bootstrap", url: "https://getbootstrap.com/docs/5.3/search/?q=[[user]]" },
  "!node": { name: "Node.js API", url: "https://nodejs.org/api/all.html#[[user]]" },
  "!dev": { name: "DEV", url: "https://dev.to/search?q=[[user]]" },

  // --- REPOS Y PAQUETES ---
  "!gh": { name: "GitHub", url: "https://github.com/search?q=[[user]]" },
  "!github": { name: "GitHub", url: "https://github.com/search?q=[[user]]" },
  "!so": { name: "Stack Overflow", url: "https://stackoverflow.com/search?q=[[user]]" },
  "!npm": { name: "NPM Registry", url: "https://www.npmjs.com/search?q=[[user]]" },
  "!pypi": { name: "PyPI", url: "https://pypi.org/search/?q=[[user]]" },
  "!docker": { name: "Docker Hub", url: "https://hub.docker.com/search?q=[[user]]" },

  // --- REFERENCIA Y COMPRAS ---
  "!w": { name: "Wikipedia (ES)", url: "https://es.wikipedia.org/wiki/[[user]]" },
  "!wikipedia": { name: "Wikipedia (ES)", url: "https://es.wikipedia.org/wiki/[[user]]" },
  "!rae": { name: "RAE", url: "https://dle.rae.es/[[user]]" },
  "!tr": { name: "Google Translate", url: "https://translate.google.com/?text=[[user]]" },
  "!maps": { name: "Google Maps", url: "https://www.google.com/maps/search/[[user]]" },
  "!a": { name: "Amazon", url: "https://www.amazon.es/s?k=[[user]]" },
  "!amazon": { name: "Amazon", url: "https://www.amazon.es/s?k=[[user]]" },
  "!can": { name: "Can I Use", url: "https://caniuse.com/?search=[[user]]" }
};
