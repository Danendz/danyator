import {useState} from "react";

export const SupportedLangsObj = {
  HTML: 'html',
  JavaScript: 'javascript',
  CSS: 'css',
} as const

export type SupportedLangsKeys = keyof typeof SupportedLangsObj;

export type SupportedLangs = typeof SupportedLangsObj[SupportedLangsKeys]

export const useSupportedLangs = () => {
  const [lang, setLang] = useState<SupportedLangs>('html');

  return [lang, setLang] as const;
}