import { supabase } from "../../lib/supabase";

export async function loadNotifications() {
  const { data: appNotifications, error: appError } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (appError) throw appError;

  const { data: signalNotifications, error: signalError } = await supabase
    .from("signal_notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (signalError) throw signalError;

  const mappedSignalNotifications = (signalNotifications || []).map((n) => ({
    id: `signal-${n.id}`,
    title: n.title,
    message: n.message,
    body: n.message,
    is_read: n.is_sent,
    created_at: n.created_at,
    type: "signal_monitor",
    target_table: "provider_signals",
    target_id: n.signal_id,
    source: "signal_notifications",
    original_id: n.id,
  }));

  return [...(appNotifications || []), ...mappedSignalNotifications].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function markNotificationAsReadById(notificationId: string) {
  if (notificationId.startsWith("signal-")) {
    const realId = notificationId.replace("signal-", "");

    const { error } = await supabase
      .from("signal_notifications")
      .update({ is_sent: true })
      .eq("id", realId);

    if (error) throw error;
    return;
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);

  if (error) throw error;
}
