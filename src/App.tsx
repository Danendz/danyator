import {Editor} from "@monaco-editor/react";
import {useEffect, useRef, useState} from "react";
import {Button} from "./components/ui/button.tsx";
import {Tabs, TabsList, TabsTrigger} from "./components/ui/tabs.tsx";
import {useSupportedLangs, SupportedLangs, SupportedLangsObj} from "./hooks/useSupportedLangs.ts";
import {useLangInput} from "./hooks/useLangInput.ts";
import {Separator} from "./components/ui/separator.tsx";
import {Input} from "./components/ui/input.tsx";
import {SendIcon} from "lucide-react";

type Log = {
  type: 'log' | 'error' | 'warn';
  message: string;
  timestamp: string;
}

function App() {
  const [lang, setLang] = useSupportedLangs();
  const [langInput, currentLangInput, saveLangInput] = useLangInput(lang)
  const [logs, setLogs] = useState<Log[]>([])
  const iframe = useRef<HTMLIFrameElement>(null);

  const handleTabChange = (newLang: string) => {
    setLang(() => newLang as SupportedLangs);
  }

  const handleEditorChange = (value: string | undefined) => {
    saveLangInput(value ?? "")
  }

  const runCode = () => {
    if (!iframe.current) {
      return
    }
    const doc = iframe.current.contentDocument || iframe.current.contentWindow?.document

    if (!doc) {
      return;
    }

    const html = langInput.html
    const css = `<style>${langInput.css}</style>`
    const js = `<script>${langInput.javascript}</script>`

    doc.open()
    doc.write(html + css + js)
    doc.close()
  }

  const loadPython = async () => {
    // const pyodide = await loadPyodide()
    // console.log(pyodide.runPython("1 + 2"))
  }

  useEffect(() => {
    if (!iframe.current?.contentWindow) return
    loadPython()
    const contentWindow = iframe.current.contentWindow
    const originalLog = contentWindow.console.log
    const originalError = contentWindow.console.log
    const originalWarn = contentWindow.console.warn

    const handleLog = (type: Log["type"], ...args: unknown[]) => {
      const message = args.map(arg => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg)).join(" ");
      setLogs(prevLogs => [...prevLogs, {type, message, timestamp: new Date().toLocaleTimeString()}]);
    }

    contentWindow.console.log = (...args) => {
      console.log('here')
      handleLog("log", ...args);
      originalLog(...args);
    };

    contentWindow.console.error = (...args) => {
      handleLog("error", ...args);
      originalError(...args);
    };

    contentWindow.console.warn = (...args) => {
      handleLog("warn", ...args);
      originalWarn(...args);
    };

    return () => {
      contentWindow.console.log = originalLog;
      contentWindow.console.error = originalError;
      contentWindow.console.warn = originalWarn;
    }
  }, [])

  return (
    <div className="w-full h-screen flex flex-row">
      <div className="w-1/2 p-2 flex flex-col gap-2">
        <Tabs value={lang} onValueChange={handleTabChange} className="w-[400px]">
          <TabsList>
            <TabsTrigger value={SupportedLangsObj.HTML}>HTML</TabsTrigger>
            <TabsTrigger value={SupportedLangsObj.JavaScript}>JavaScript</TabsTrigger>
            <TabsTrigger value={SupportedLangsObj.CSS}>CSS</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="rounded-lg h-full border-black bg-black p-[3px]">
          <Editor key={lang} language={lang} value={currentLangInput} onChange={handleEditorChange} theme="vs-dark"
                  height="100%"/>
        </div>
      </div>
      <div className="w-1/2 flex flex-col p-2 gap-2">
        <div>
          <Button onClick={runCode}>Run code</Button>
        </div>
        <div className="h-full p-2 rounded-lg border-black/30 border-1">
          <iframe ref={iframe} width="100%" height="100%"></iframe>
        </div>
        <div className="flex flex-col h-1/4 p-2 border-black/30 border-1 rounded-lg">
          <div className="h-full overflow-y-auto px-1">
            {logs.map((log, i) => {
              return (
                <>
                  <div className="py-1" key={log.timestamp}>{log.message}</div>
                  {i !== logs.length - 1 && <Separator/>}
                </>
              )
            })}
          </div>
          <div>
            <Separator/>
            <div className="pt-2 w-full flex gap-2">
              <div className="w-full">
                <Input placeholder="Enter javascript commands"/>
              </div>
              <div>
                <Button><SendIcon /></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
