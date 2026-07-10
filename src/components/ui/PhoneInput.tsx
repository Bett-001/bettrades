import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

export interface Country {
  code: string;
  name: string;
  dial: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  // East Africa first
  { code: "KE", name: "Kenya",        dial: "+254", flag: "🇰🇪" },
  { code: "TZ", name: "Tanzania",     dial: "+255", flag: "🇹🇿" },
  { code: "UG", name: "Uganda",       dial: "+256", flag: "🇺🇬" },
  { code: "RW", name: "Rwanda",       dial: "+250", flag: "🇷🇼" },
  { code: "ET", name: "Ethiopia",     dial: "+251", flag: "🇪🇹" },
  { code: "SS", name: "South Sudan",  dial: "+211", flag: "🇸🇸" },
  { code: "BI", name: "Burundi",      dial: "+257", flag: "🇧🇮" },
  // Rest of Africa
  { code: "NG", name: "Nigeria",      dial: "+234", flag: "🇳🇬" },
  { code: "GH", name: "Ghana",        dial: "+233", flag: "🇬🇭" },
  { code: "ZA", name: "South Africa", dial: "+27",  flag: "🇿🇦" },
  { code: "EG", name: "Egypt",        dial: "+20",  flag: "🇪🇬" },
  { code: "MA", name: "Morocco",      dial: "+212", flag: "🇲🇦" },
  { code: "SN", name: "Senegal",      dial: "+221", flag: "🇸🇳" },
  { code: "CI", name: "Côte d'Ivoire",dial: "+225", flag: "🇨🇮" },
  { code: "CM", name: "Cameroon",     dial: "+237", flag: "🇨🇲" },
  { code: "ZM", name: "Zambia",       dial: "+260", flag: "🇿🇲" },
  { code: "ZW", name: "Zimbabwe",     dial: "+263", flag: "🇿🇼" },
  // Global
  { code: "US", name: "United States",    dial: "+1",   flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom",   dial: "+44",  flag: "🇬🇧" },
  { code: "IN", name: "India",            dial: "+91",  flag: "🇮🇳" },
  { code: "CN", name: "China",            dial: "+86",  flag: "🇨🇳" },
  { code: "PK", name: "Pakistan",         dial: "+92",  flag: "🇵🇰" },
  { code: "BD", name: "Bangladesh",       dial: "+880", flag: "🇧🇩" },
  { code: "NG", name: "Nigeria",          dial: "+234", flag: "🇳🇬" },
  { code: "PH", name: "Philippines",      dial: "+63",  flag: "🇵🇭" },
  { code: "DE", name: "Germany",          dial: "+49",  flag: "🇩🇪" },
  { code: "FR", name: "France",           dial: "+33",  flag: "🇫🇷" },
  { code: "IT", name: "Italy",            dial: "+39",  flag: "🇮🇹" },
  { code: "ES", name: "Spain",            dial: "+34",  flag: "🇪🇸" },
  { code: "CA", name: "Canada",           dial: "+1",   flag: "🇨🇦" },
  { code: "AU", name: "Australia",        dial: "+61",  flag: "🇦🇺" },
  { code: "AE", name: "UAE",              dial: "+971", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia",     dial: "+966", flag: "🇸🇦" },
  { code: "BR", name: "Brazil",           dial: "+55",  flag: "🇧🇷" },
  { code: "MX", name: "Mexico",           dial: "+52",  flag: "🇲🇽" },
  { code: "ID", name: "Indonesia",        dial: "+62",  flag: "🇮🇩" },
  { code: "JP", name: "Japan",            dial: "+81",  flag: "🇯🇵" },
  { code: "KR", name: "South Korea",      dial: "+82",  flag: "🇰🇷" },
  { code: "TR", name: "Turkey",           dial: "+90",  flag: "🇹🇷" },
  { code: "RU", name: "Russia",           dial: "+7",   flag: "🇷🇺" },
  { code: "NL", name: "Netherlands",      dial: "+31",  flag: "🇳🇱" },
  { code: "SE", name: "Sweden",           dial: "+46",  flag: "🇸🇪" },
  { code: "NO", name: "Norway",           dial: "+47",  flag: "🇳🇴" },
  { code: "CH", name: "Switzerland",      dial: "+41",  flag: "🇨🇭" },
  { code: "SG", name: "Singapore",        dial: "+65",  flag: "🇸🇬" },
  { code: "MY", name: "Malaysia",         dial: "+60",  flag: "🇲🇾" },
  { code: "TH", name: "Thailand",         dial: "+66",  flag: "🇹🇭" },
  { code: "NZ", name: "New Zealand",      dial: "+64",  flag: "🇳🇿" },
  { code: "QA", name: "Qatar",            dial: "+974", flag: "🇶🇦" },
  { code: "KW", name: "Kuwait",           dial: "+965", flag: "🇰🇼" },
];

// deduplicate by code+dial
const seen = new Set<string>();
const UNIQUE_COUNTRIES = COUNTRIES.filter(c => {
  const key = c.code + c.dial;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

interface PhoneInputProps {
  value: string;
  onChange: (full: string, local: string, country: Country) => void;
  disabled?: boolean;
}

const PhoneInput = ({ value, onChange, disabled }: PhoneInputProps) => {
  const [selected, setSelected] = useState<Country>(UNIQUE_COUNTRIES[0]);
  const [local, setLocal] = useState("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = UNIQUE_COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial.includes(search)
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLocal = (val: string) => {
    const digits = val.replace(/\D/g, "");
    setLocal(digits);
    onChange(selected.dial + digits, digits, selected);
  };

  const handleSelect = (country: Country) => {
    setSelected(country);
    setOpen(false);
    setSearch("");
    onChange(country.dial + local, local, country);
  };

  return (
    <div ref={ref} className="relative flex gap-0">
      {/* Country selector button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 h-10 rounded-l-md border border-r-0 border-border bg-secondary hover:bg-muted transition-colors text-sm shrink-0 min-w-[90px]"
      >
        <span className="text-base leading-none">{selected.flag}</span>
        <span className="text-muted-foreground font-mono text-xs">{selected.dial}</span>
        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Number input */}
      <input
        type="tel"
        placeholder="7XX XXX XXX"
        value={local}
        onChange={e => handleLocal(e.target.value)}
        disabled={disabled}
        className="flex-1 h-10 rounded-r-md border border-border bg-secondary px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 disabled:opacity-50"
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-72 rounded-xl border border-border bg-card shadow-xl overflow-hidden">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
            <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search country..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          {/* List */}
          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">No country found</p>
            ) : (
              filtered.map(c => (
                <button
                  key={c.code + c.dial}
                  type="button"
                  onClick={() => handleSelect(c)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-secondary transition-colors text-left ${
                    selected.code === c.code && selected.dial === c.dial ? "bg-primary/10 text-primary" : ""
                  }`}
                >
                  <span className="text-base leading-none w-6 text-center">{c.flag}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-muted-foreground font-mono text-xs shrink-0">{c.dial}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneInput;
