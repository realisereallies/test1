import React from 'react'
import burgerIcon from '../assets/burger.svg'
import './Header.css'

interface HeaderProps {
  onMenuToggle: () => void
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="header">
      <button className="header__menu-button" onClick={onMenuToggle}>
        <img src={burgerIcon} alt="Menu" className="header__burger-icon" />
      </button>
      <h1 className="header__title">BESIDER</h1>
      <div className="header__spacer"></div>
    </header>
  )
}

export default Header
