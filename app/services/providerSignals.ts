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
    .order("display_order", { ascending: true });

  if (error) throw error;

  return data || [];
}

export async function createSignalProvider(provider: any) {
  const { data, error } = await supabase
    .from("signal_providers")
    .insert([provider])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateSignalProvider(
  providerId: string,
  updates: any
) {
  const { error } = await supabase
    .from("signal_providers")
    .update(updates)
    .eq("id", providerId);

  if (error) throw error;
}

export async function deleteSignalProvider(providerId: string) {
  const { error } = await supabase
    .from("signal_providers")
    .delete()
    .eq("id", providerId);

  if (error) throw error;
}
