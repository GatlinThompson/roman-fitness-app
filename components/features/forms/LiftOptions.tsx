"use client";

import { useState, useEffect, useRef } from "react";

const commonLifts = [
  "Bench Press",
  "Squat",
  "Deadlift",
  "Overhead Press",
  "Barbell Row",
  "Pull-ups",
  "Chin-ups",
  "Dips",
  "Lunges",
  "Romanian Deadlift",
  "Front Squat",
  "Incline Bench Press",
  "Decline Bench Press",
  "Lat Pulldown",
  "Cable Row",
  "Dumbbell Press",
  "Dumbbell Row",
  "Bicep Curl",
  "Tricep Extension",
  "Lateral Raise",
  "Face Pull",
  "Leg Press",
  "Leg Curl",
  "Leg Extension",
  "Calf Raise",
];

type LiftOptionsProps = {
  onSelect: (lift: string) => void;
};

export default function LiftOptions({ onSelect }: LiftOptionsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLifts, setFilteredLifts] = useState(commonLifts);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [customLifts, setCustomLifts] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const allLifts = [...customLifts, ...commonLifts];
    if (searchTerm.trim() === "") {
      setFilteredLifts(allLifts);
    } else {
      const filtered = allLifts.filter((lift) =>
        lift.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLifts(filtered);
    }
    setHighlightedIndex(-1);
  }, [searchTerm, customLifts]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLift = (lift: string) => {
    setSearchTerm(lift);
    onSelect(lift);

    const handleAddCustomLift = () => {
      if (
        searchTerm.trim() &&
        !customLifts.includes(searchTerm.trim()) &&
        !commonLifts.includes(searchTerm.trim())
      ) {
        setCustomLifts((prev) => [searchTerm.trim(), ...prev]);
        setIsOpen(false);
      }
    };
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setIsOpen(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredLifts.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelectLift(filteredLifts[highlightedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="w-full relative" ref={wrapperRef}>
      <label
        htmlFor="lift-search"
        className="block text-sm font-semibold mb-2 text-gray-700"
      >
        Search Lift
      </label>
      <div className="relative">
        <input
          id="lift-search"
          type="text"
          name="lift-option"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Type to search lifts..."
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
          autoComplete="off"
        />
        <svg
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {isOpen && filteredLifts.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          <div className="py-1">
            {filteredLifts.map((lift, index) => (
              <div
                key={lift}
                onClick={() => handleSelectLift(lift)}
                className={`px-4 py-2.5 cursor-pointer transition-colors ${
                  index === highlightedIndex
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-50 text-gray-800"
                }`}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{lift}</span>
                  {searchTerm &&
                    lift.toLowerCase().includes(searchTerm.toLowerCase()) && (
                      <svg
                        className={`w-4 h-4 ${
                          index === highlightedIndex
                            ? "text-white"
                            : "text-blue-500"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
