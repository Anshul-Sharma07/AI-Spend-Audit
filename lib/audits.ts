import { getServiceSupabase } from "./supabase";

export async function getAudit(id: string) {
  const db = getServiceSupabase();
  const { data, error } = await db
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}
