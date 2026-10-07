import { createClient } from "@supabase/supabase-js";

// 창고(Supabase) 로 가는 문 하나. 주소·열쇠는 .env.local 에 있다 (PRD 8.3).
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
