import {Editor} from "@monaco-editor/react";
import {useEffect, useRef, useState} from "react";

function App() {
  const [html, setHtml] = useState('');
  const iframe = useRef<HTMLIFrameElement>(null);
  const TIMEOUT_BEFORE_RUN = 3000

  const handleEditorChange = (value: string | undefined) => {
    setHtml(value ?? '');
  }

  const runCode = () => {
    if (!iframe.current) {
      return
    }
    const doc = iframe.current.contentDocument || iframe.current.contentWindow?.document

    if (!doc) {
      return;
    }

    doc.open()
    doc.write(html)
    doc.close()
  }

  useEffect(() => {
    if (!html) return

    const timeout = setTimeout(() => {
      runCode()
    }, TIMEOUT_BEFORE_RUN)

    return () => clearTimeout(timeout)
  }, [html])

  return (
    <div className="w-full h-screen flex flex-row">
      <div className="w-1/2 p-2">
        <div className="rounded-lg h-full border-black bg-black p-[2px]">
          <Editor onChange={handleEditorChange} theme="vs-dark" height="100%" defaultLanguage="html"/>
        </div>
      </div>
      <div className="w-1/2 flex flex-col p-2 gap-2">
        <div className="h-full p-2 rounded-lg border-black/30 border-1">
          {/*<button className="border-1 border-black rounded-lg px-2 hover:bg-black/20 hover:cursor-pointer duration-75" onClick={runCode}>Run</button>*/}
          <iframe ref={iframe} width="100%" height="100%"></iframe>
        </div>
        <div className="h-1/4 p-2 border-black/30 border-1 rounded-lg">
          <div>console</div>
        </div>
      </div>
    </div>
  )
}

export default App
