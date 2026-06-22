import { supabase } from "../../lib/supabase";

export async function loadProviderSignals() {
  const { data, error } = await supabase
    .from("provider_signals")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;

  return data || [];
}

export async function loadSignalProviders() {
  const { data, error } = await supabase
    .from("signal_providers")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) throw error;

  return data || [];
}
