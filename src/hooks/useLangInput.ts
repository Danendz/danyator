import {useMemo, useState} from "react";
import {SupportedLangs } from "./useSupportedLangs.ts";

const defaultLangValues: Record<SupportedLangs, string> = {
  html: '<div class="red">Hello Adelina</div>',
  javascript: 'console.log("Hello Adelina")',
  css: '.red {\n\tcolor: red\n}'
} as const

const setLangContentToLocalStorage = (key: SupportedLangs, value: string) => {
  localStorage.setItem(`lang_content_${key}`, value);
}

const getLangContentFromLocalStorage = (key: SupportedLangs) => {
  return localStorage.getItem(`lang_content_${key}`);
}

const getDefaultLangValues = () => {
  return Object.keys(defaultLangValues).reduce((acc, currentValue) => {
    const curr = currentValue as SupportedLangs

    const localStorageContent = getLangContentFromLocalStorage(curr);

    acc[curr] = localStorageContent ?? defaultLangValues[curr];

    return acc
  }, {} as Record<SupportedLangs, string>);
}

let saveTimeout: NodeJS.Timeout
export const useLangInput = (lang: SupportedLangs) => {
  const [langInput, setLangInput] = useState(getDefaultLangValues());

  const saveLangInput = (value: string) => {
    clearTimeout(saveTimeout)
    saveTimeout = setTimeout(() => {
      setLangContentToLocalStorage(lang, value);
      setLangInput((prevState) => ({...prevState, [lang]: value}));
    }, 1000)
  }

  const currentLangInput= useMemo(() => {
    return langInput[lang];
  }, [langInput, lang])

  return [langInput, currentLangInput, saveLangInput] as const;
}