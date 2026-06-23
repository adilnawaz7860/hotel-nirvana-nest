"use client";

import { useLanguageStore } from "@/store/language.store";
import { dictionaries } from "@/lib/i18n/dictionaries";

export function useTranslation() {
  const locale = useLanguageStore((state) => state.locale);
  const setLocale = useLanguageStore((state) => state.setLocale);

  return { t: dictionaries[locale], locale, setLocale };
}
