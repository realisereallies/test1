import { useState } from 'react'
import { Provider } from 'react-redux'
import { store } from './store'
import Header from './components/Header'
import NewsList from './components/NewsList'
import Menu from './components/Menu'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleMenuClose = () => {
    setIsMenuOpen(false)
  }

  return (
    <Provider store={store}>
      <div className="app">
        <Header onMenuToggle={handleMenuToggle} />
        <main className="app__main-content">
          <NewsList />
        </main>
        <Footer />
        <Menu isOpen={isMenuOpen} onClose={handleMenuClose} />
      </div>
    </Provider>
  )
}

export default App
