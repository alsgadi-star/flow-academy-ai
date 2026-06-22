import { supabase } from "../../lib/supabase";

export async function loadAcademyPosts() {
  const { data, error } = await supabase
    .from("academy_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function createAcademyPost(academyItem: any) {
  const { data, error } = await supabase
    .from("academy_posts")
    .insert([academyItem])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function createAcademyNotification(post: any) {
  const { error } = await supabase.from("notifications").insert([
    {
      title: "محتوى جديد في الأكاديمية",
      message: post.title,
      type: post.type,
      target_id: post.id,
      target_table: "academy_posts",
    },
  ]);

  if (error) throw error;
}
