"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी" },
  { code: "or", name: "ଓଡ଼ିଆ" },
  // { code: "pa", name: "ਪੰਜਾਬੀ" },
  // { code: "ta", name: "தமிழ்" },
  // { code: "bn", name: "বাংলা" },
  // { code: "te", name: "తెలుగు" },
  // { code: "mr", name: "मराठी" },
  // { code: "gu", name: "ગુજરાતી" },
  // { code: "kn", name: "ಕನ್ನಡ" },
  // { code: "ml", name: "മലയാളം" },
  // { code: "as", name: "অসমীয়া" },
  // { code: "ur", name: "اردو" },
  // { code: "ks", name: "کٲشُر" },
  // { code: "sat", name: "ᱥᱟᱱᱛᱟᱲᱤ" },
];

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [selected, setSelected] = useState(languages[0]);

  useEffect(() => {
    // Get current locale from cookie
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("NEXT_LOCALE="))
      ?.split("=")[1];
    
    if (cookieLocale) {
      const foundLang = languages.find(lang => lang.code === cookieLocale) || languages[0];
      setSelected(foundLang);
    }
  }, []);

  const changeLocale = (newLocale: string) => {
    // Set cookie with 1 year expiration
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `NEXT_LOCALE=${newLocale}; expires=${expires.toUTCString()}; path=/`;
    
    // Refresh the page to apply new locale
    router.refresh();
  };

  return (
    <div className="relative w-72 font-sans text-gray-800">
      <button
        className="w-full flex items-center justify-between p-3 bg-white rounded-lg shadow-md border border-gray-200"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <span className="font-medium">{selected.name}</span>
        </span>
        <span className="text-gray-400">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <ul
          className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-72 overflow-auto"
          role="listbox"
          tabIndex={-1}
        >
          {languages.map((lang) => (
            <li
              key={lang.code}
              className={`cursor-pointer px-4 py-3 hover:bg-green-50 flex justify-between items-center ${
                lang.code === selected.code ? "bg-green-100" : ""
              }`}
              onClick={() => {
                setSelected(lang);
                changeLocale(lang.code);
                setOpen(false);
              }}
              role="option"
              aria-selected={lang.code === selected.code}
            >
              <span>{lang.name}</span>
              {lang.code === selected.code && (
                <span className="text-green-600 font-bold ml-2">✓</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}