import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// const App2 = () => {
//     const ws = new WebSocket('ws://0.0.0.0:1234')
//     ws.onopen = () => {
//         if (ws.readyState === 1) 
//             console.log('connected')
//     }
//     return (<div>hello</div>)
// }

ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
)
