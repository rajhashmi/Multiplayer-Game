import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {Canvas} from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

createRoot(document.getElementById('root')).render(
    <Canvas>
        <OrbitControls/>
        <ambientLight intensity={ 1.5 } />

    <App />
    </Canvas>
)
