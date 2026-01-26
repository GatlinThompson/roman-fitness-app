import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export type Phase = {
  phase: {
    level: string;
    phase_number: number;
    percentage: number;
  };
  start_date: string;
  end_date: string;
};

export function useGetPhase() {
  const [phase, setPhase] = useState<Phase | null>(null);

  const fetchPhase = async () => {
    const today = "2026-01-26";
    const { data, error } = await supabase
      .from("phase_management")
      .select("phase(level, phase_number, percentage), start_date, end_date")
      .lte("start_date", today)
      .limit(1);

    if (error) {
      console.error("Error fetching phases:", error);
      return;
    }

    if (data && data.length > 0) {
      const result = data[0];

      setPhase({
        ...result,
        phase: Array.isArray(result.phase) ? result.phase[0] : result.phase,
      });
    }
  };
  useEffect(() => {
    fetchPhase();
  }, []);

  console.log(phase);

  return phase;
}
