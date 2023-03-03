import { FC } from 'react'
import ReactLogo from './assets/images/react.svg'
import './assets/styles/app.css'
import './assets/styles/app.scss'

const App: FC = () => {
  return (
    <div>
      <img src={ReactLogo} alt='React Logo' width={100} height={100} />
      <h2>Bài viết được viết tại blog</h2>
    </div>
  )
}

export default App
