import Quill from 'quill'
import QuillCursors from 'quill-cursors'

import * as Y from 'yjs'
import { QuillBinding } from 'y-quill'
import { WebsocketProvider } from 'y-websocket'

import React, { useEffect, useRef, useState } from 'react'

function App() {
  const ydoc = useRef<Y.Doc | null>(null)
  const yText = useRef<Y.Text | null>(null)
  const provider = useRef<WebsocketProvider | null>(null)
  const quillRef = useRef<HTMLDivElement | null>(null)
  const [name, setName] = useState('')
  const [userList, setUserList] = useState<string[]>(() => 
  provider?.current?.awareness ? Array.from(provider.current.awareness.states).map(s => s[1].user.name) : []
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
  const handleChangeName = () => {
    provider.current?.awareness.setLocalStateField('user', {
      name,
      // a random color for the cursor
      color:
        '#' +
        Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .padStart(6, '0'),
    })
  }

  useEffect(() => {
    Quill.register('modules/cursors', QuillCursors)
    const quill = new Quill(quillRef.current!, {
      modules: {
        cursors: true,
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block'],
        ],
        history: {
          userOnly: true,
        },
      },
      placeholder: 'Start collaborating...',
      theme: 'snow',
    })
    ydoc.current = new Y.Doc()
    yText.current = ydoc.current.getText('quill')
    const url = 'ws://localhost:1234'
    provider.current = new WebsocketProvider(url, 'quill-demo-room', ydoc.current)
    const awareness = provider.current.awareness
    awareness.setLocalStateField('user', {
      // random name
      name: 'user' + Math.floor(Math.random() * 100),
      // a random color for the cursor
      color:
        '#' +
        Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .padStart(6, '0'),
    })
    awareness.on('change', () => {
      setUserList(
        Array.from(awareness.states).map(
          (state) => state[1]?.user?.name
        )
      )
    })
    const binding = new QuillBinding(
      yText.current,
      quill,
      awareness
    )
    return () => {
      binding.destroy()
      provider.current?.disconnect()
      ydoc.current?.destroy()
    }
  }, [])
  return (
    <div>
      <div>your name: </div>
      <input value={name} onChange={onChange} />
      <button onClick={handleChangeName}>save name</button>
      <div>
        <h3>users joined room</h3>
        {userList.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
      <div id="editor" ref={quillRef}></div>
    </div>
  )
}

export default App
