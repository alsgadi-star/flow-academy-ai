import { supabase } from "../../lib/supabase";

export async function loadSubscription(userId: string) {
  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (data) {
    return data;
  }

  const { data: newSubscription } = await supabase
    .from("subscriptions")
    .insert([
      {
        user_id: userId,
        plan: "free",
        status: "active",
      },
    ])
    .select()
    .single();

  return newSubscription;
}

export async function updateUserSubscription(
  userId: string,
  plan: string
) {
  const { error } = await supabase
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        plan,
        status: "active",
      },
      {
        onConflict: "user_id",
      }
    );

  if (error) throw error;
}
