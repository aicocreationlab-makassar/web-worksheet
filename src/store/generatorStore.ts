"use client";
import { create } from "zustand";
import {
  baseSchema,
  defaultForm,
  WorksheetFormSchema,
  type DraftForm,
  type WorksheetForm,
} from "@/lib/schemas/worksheet";

export type HistoryItem = {
  id: string;
  createdAt: string;
  title: string;
  form: WorksheetForm;
  prompt: string;
};
type State = {
  form: DraftForm;
  step: number;
  prompt: string;
  resultForm: WorksheetForm | null;
  history: HistoryItem[];
  resultId: string | null;
  continuationPage: number;
  hydrated: boolean;
  storageWarning: boolean;
  hydrate: () => void;
  update: (data: Partial<DraftForm>) => void;
  setStep: (step: number) => void;
  start: (form?: WorksheetForm) => void;
  saveResult: (form: WorksheetForm, prompt: string, title: string) => void;
  editPrompt: (prompt: string) => void;
  restore: (item: HistoryItem) => void;
  clearHistory: () => void;
  setContinuationPage: (page: number) => void;
};
const KEY = "lembarceria-v1";
export function migrateStoredForm(value: unknown) {
  if (!value || typeof value !== "object")
    return WorksheetFormSchema.safeParse(value);
  const old = value as Record<string, unknown>;
  return WorksheetFormSchema.safeParse({
    ...old,
    pageCount: old.pageCount ?? 1,
  });
}
function readHistory(value: unknown): HistoryItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .flatMap((item) => {
      if (
        !item ||
        typeof item.id !== "string" ||
        typeof item.title !== "string" ||
        typeof item.prompt !== "string" ||
        item.prompt.length > 30000 ||
        !Number.isFinite(Date.parse(item.createdAt))
      )
        return [];
      const form = migrateStoredForm(item.form);
      return form.success
        ? [
            {
              id: item.id,
              createdAt: item.createdAt,
              title: item.title,
              form: form.data,
              prompt: item.prompt,
            },
          ]
        : [];
    })
    .slice(0, 10);
}
export const useGenerator = create<State>((set, get) => {
  const persist = () => {
    try {
      const {
        form,
        step,
        prompt,
        resultForm,
        history,
        resultId,
        continuationPage,
      } = get();
      localStorage.setItem(
        KEY,
        JSON.stringify({
          form,
          step,
          prompt,
          resultForm,
          history,
          resultId,
          continuationPage,
        }),
      );
    } catch {
      set({ storageWarning: true });
    }
  };
  return {
    form: { ...defaultForm },
    step: 0,
    prompt: "",
    resultForm: null,
    history: [],
    resultId: null,
    continuationPage: 2,
    hydrated: false,
    storageWarning: false,
    hydrate: () => {
      if (get().hydrated) return;
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          const stored = JSON.parse(raw);
          if (!stored || typeof stored !== "object")
            throw new Error("Invalid local data");
          const result = migrateStoredForm(stored.resultForm),
            history = readHistory(stored.history),
            draft = { ...defaultForm };
          if (stored.form && typeof stored.form === "object") {
            for (const key of Object.keys(
              baseSchema.shape,
            ) as (keyof WorksheetForm)[]) {
              const candidate = stored.form[key];
              if (candidate === undefined) continue;
              const parsed = baseSchema.shape[key].safeParse(candidate);
              if (parsed.success) Object.assign(draft, { [key]: parsed.data });
              else if (
                candidate === "" &&
                ["theme", "ageRange", "activityType"].includes(key)
              )
                Object.assign(draft, { [key]: "" });
            }
          }
          const prompt =
            result.success && typeof stored.prompt === "string"
              ? stored.prompt.slice(0, 30000)
              : "";
          set({
            form: draft,
            step: Number.isInteger(stored.step)
              ? Math.max(0, Math.min(4, stored.step))
              : 0,
            prompt,
            resultForm: result.success ? result.data : null,
            history,
            resultId:
              history.find((x) => x.id === stored.resultId)?.id ??
              history.find((x) => x.prompt === prompt)?.id ??
              null,
            continuationPage: Number.isInteger(stored.continuationPage)
              ? Math.max(
                  2,
                  Math.min(
                    result.success ? result.data.pageCount : 2,
                    stored.continuationPage,
                  ),
                )
              : 2,
          });
        }
      } catch {
        set({ storageWarning: true });
      }
      set({ hydrated: true });
    },
    update: (data) => {
      set({ form: { ...get().form, ...data } });
      persist();
    },
    setStep: (step) => {
      set({ step });
      persist();
    },
    start: (form) => {
      set({ form: form ? { ...form } : { ...defaultForm }, step: 0 });
      persist();
    },
    saveResult: (form, prompt, title) => {
      const id =
        globalThis.crypto?.randomUUID?.() ??
        "worksheet-" + Date.now() + "-" + Math.random().toString(36).slice(2);
      const item = {
        id,
        createdAt: new Date().toISOString(),
        title,
        form,
        prompt,
      };
      set({
        prompt,
        resultForm: form,
        resultId: id,
        continuationPage: 2,
        history: [item, ...get().history].slice(0, 10),
      });
      persist();
    },
    editPrompt: (prompt) => {
      set({
        prompt,
        history: get().history.map((x) =>
          x.id === get().resultId ? { ...x, prompt } : x,
        ),
      });
      persist();
    },
    restore: (item) => {
      set({
        form: { ...item.form },
        resultForm: item.form,
        prompt: item.prompt,
        resultId: item.id,
        step: 4,
        continuationPage: 2,
      });
      persist();
    },
    clearHistory: () => {
      set({ history: [], resultId: null });
      persist();
    },
    setContinuationPage: (page) => {
      const count = get().resultForm?.pageCount ?? 2;
      if (Number.isInteger(page) && page >= 2 && page <= count) {
        set({ continuationPage: page });
        persist();
      }
    },
  };
});
