import React, { useEffect } from 'react'
import './Menu.css'

interface MenuProps {
  isOpen: boolean
  onClose: () => void
}

const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      // Block scroll when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      // Restore scroll when menu is closed
      document.body.style.overflow = 'unset'
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      <div className="menu__overlay" onClick={onClose}></div>
      <div className="menu">
        <div className="menu__header">
          <button className="menu__close-button" onClick={onClose}>
            <svg width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 10L10 30M10 10L30 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="menu__content">
          <div className="menu__item">
            <a className="menu__item-text">SCIENCE</a>
          </div>
          <div className="menu__item">
            <a className="menu__item-text">GENERAL</a>
          </div>
          <div className="menu__item">
            <a className="menu__item-text">ENTERTAINMENT</a>
          </div>
          <div className="menu__item">
            <a className="menu__item-text">TECHNOLOGY</a>
          </div>
          <div className="menu__item">
            <a className="menu__item-text">BUSINESS</a>
          </div>
          <div className="menu__item">
            <a className="menu__item-text">HEALTH</a>
          </div>
          <div className="menu__item">
            <a className="menu__item-text">SPORTS</a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Menu
