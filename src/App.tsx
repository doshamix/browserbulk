import { useState, useCallback, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, CheckSquare, Square, X, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchEngine {
  name: string;
  url: string;
  icon?: string;
}

const searchEngines: SearchEngine[] = [
  { name: "Google", url: "https://www.google.com/search?q=" },
  { name: "Yandex", url: "https://yandex.com/search/?text=" },
  { name: "Brave", url: "https://search.brave.com/search?q=" },
  { name: "Startpage", url: "https://www.startpage.com/do/search?query=" },
  { name: "Bing", url: "https://www.bing.com/search?q=" },
  { name: "BT4G", url: "https://bt4gprx.com/search?q=" },
  { name: "Yahoo", url: "https://search.yahoo.com/search?p=" },
  { name: "Ask", url: "https://www.ask.com/web?q=" },
  { name: "Baidu", url: "https://www.baidu.com/s?wd=" },
  { name: "Searx", url: "https://searx.be/?q=" },
  { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
  { name: "Swisscows", url: "https://swisscows.com/en/web?query=" },
  { name: "Naver", url: "https://search.naver.com/search.naver?query=" },
  { name: "Kagi", url: "https://kagi.com/search?q=" },
  { name: "Stract", url: "https://stract.com/search?q=" }
];

export default function App() {
  const [query, setQuery] = useState('');
  const [engineFilter, setEngineFilter] = useState('');
  const [selectedEngines, setSelectedEngines] = useState<Set<string>>(new Set());
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const filteredEngines = useMemo(() => 
    searchEngines.filter(engine => 
      engine.name.toLowerCase().includes(engineFilter.toLowerCase())
    ),
    [engineFilter]
  );

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query || selectedEngines.size === 0) return;
    
    const selectedUrls = searchEngines
      .filter(engine => selectedEngines.has(engine.name))
      .map(engine => engine.url + encodeURIComponent(query));

    selectedUrls.forEach(url => {
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }, [query, selectedEngines]);

  const toggleEngine = useCallback((engineName: string) => {
    setSelectedEngines(prev => {
      const next = new Set(prev);
      if (next.has(engineName)) {
        next.delete(engineName);
      } else {
        next.add(engineName);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback((select: boolean) => {
    setSelectedEngines(new Set(select ? filteredEngines.map(e => e.name) : []));
  }, [filteredEngines]);

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" 
        : "bg-gradient-to-br from-blue-50 via-white to-blue-50 text-gray-900"
    )}>
      <div className="max-w-4xl mx-auto space-y-8 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
              <Search className="w-10 h-10 text-blue-500 relative z-10" />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Multi Search Pro
            </h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={cn(
              "rounded-full",
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"
            )}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>

        <Card className={cn(
          "p-6 border transition-colors duration-300",
          isDarkMode 
            ? "bg-gray-800/50 border-gray-700" 
            : "bg-white/50 border-gray-200"
        )}>
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your search query..."
                className={cn(
                  "transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400",
                  isDarkMode 
                    ? "bg-gray-900 border-gray-700 text-white selection:bg-blue-500/30" 
                    : "bg-white border-gray-300 text-gray-900 selection:bg-blue-100"
                )}
              />
            </div>
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!query || selectedEngines.size === 0}
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  value={engineFilter}
                  onChange={(e) => setEngineFilter(e.target.value)}
                  placeholder="Filter search engines..."
                  className={cn(
                    "transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400",
                    isDarkMode 
                      ? "bg-gray-900 border-gray-700 text-white selection:bg-blue-500/30" 
                      : "bg-white border-gray-300 text-gray-900 selection:bg-blue-100"
                  )}
                  prefix={<Search className="h-4 w-4 text-gray-400" />}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => toggleAll(true)}
                className={cn(
                  "transition-colors duration-300",
                  isDarkMode 
                    ? "border-gray-700 hover:bg-gray-700" 
                    : "border-gray-300 hover:bg-gray-100"
                )}
              >
                <CheckSquare className="mr-2 h-4 w-4" />
                Select All
              </Button>
              <Button
                variant="outline"
                onClick={() => toggleAll(false)}
                className={cn(
                  "transition-colors duration-300",
                  isDarkMode 
                    ? "border-gray-700 hover:bg-gray-700" 
                    : "border-gray-300 hover:bg-gray-100"
                )}
              >
                <Square className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredEngines.map((engine) => (
                <button
                  key={engine.name}
                  onClick={() => toggleEngine(engine.name)}
                  className={cn(
                    "p-3 rounded-lg border transition-all duration-200",
                    selectedEngines.has(engine.name)
                      ? "border-blue-500 bg-blue-500/20"
                      : isDarkMode
                        ? "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                        : "border-gray-300 bg-white/50 hover:border-gray-400"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>{engine.name}</span>
                    </div>
                    {selectedEngines.has(engine.name) && (
                      <Badge variant="secondary" className="bg-blue-600">
                        Selected
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {selectedEngines.size > 0 && (
          <div className="flex flex-wrap gap-2">
            {Array.from(selectedEngines).map(name => (
              <Badge
                key={name}
                variant="secondary"
                className={cn(
                  "cursor-pointer",
                  isDarkMode
                    ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                )}
                onClick={() => toggleEngine(name)}
              >
                {name}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}