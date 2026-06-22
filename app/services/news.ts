import { supabase } from "../../lib/supabase";

export async function loadNews() {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function createNews(newsItem: any) {
  const { data, error } = await supabase
    .from("news")
    .insert([newsItem])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function createNewsNotification(newsItem: any) {
  const { error } = await supabase.from("notifications").insert([
    {
      title: "خبر اقتصادي جديد",
      message: newsItem.title,
      body: newsItem.content,
      type: "news",
      target_id: newsItem.id,
      target_table: "news",
    },
  ]);

  if (error) throw error;
}
