type Event =
  | "generator_started"
  | "generator_step_completed"
  | "prompt_generated"
  | "prompt_copied"
  | "followup_copied"
  | "open_chatgpt_clicked";
export function track(
  event: Event,
  properties: Record<string, string | number> = {},
) {
  if (typeof window !== "undefined")
    window.dispatchEvent(
      new CustomEvent("lembarceria:analytics", {
        detail: { event, properties },
      }),
    );
}
