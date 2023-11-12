import React, { useState } from 'react'
import { Editor, Node, Transforms, createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

import './App.css'
import { log } from 'console'
const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
]

function App() {
  const [editor] = useState(() => withReact(createEditor()))

  return (
    <div className="con">
      <button
        onClick={() => {
          console.log(Editor.nodes(editor).next())
        }}
      >
        click me
      </button>
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={(e) => console.log(e)}
      >
        <Editable />
      </Slate>
    </div>
  )
}

export default App
