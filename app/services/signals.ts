import { supabase } from "../../lib/supabase";

export async function loadSignals() {
  const { data, error } = await supabase
    .from("signals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function createSignal(newSignal: any) {
  const { data, error } = await supabase
    .from("signals")
    .insert([newSignal])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function createSignalNotification(signal: any) {
  const { error } = await supabase.from("notifications").insert([
    {
      title: "إشارة تداول جديدة",
      message: `${signal.symbol} ${signal.direction}`,
      body: `الدخول: ${signal.entry_price} | الستوب: ${signal.sl}`,
      type: "signal",
      target_id: signal.id,
      target_table: "signals",
    },
  ]);

  if (error) throw error;
}
