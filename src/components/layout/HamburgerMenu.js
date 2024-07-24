import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '../atomic/atoms/Button'
import { MENUS } from './Header'
import { MENU_DEFAULT_COLOR, SELECTED_MENU_COLOR } from '../../consts/color'
import { Link } from 'react-router-dom'
const HamburgerButtonWrap = styled.div`
  @media screen and (min-width: 1024px) {
    display: none;
  }
`

const HamburgerButton = styled(Button)`
  width: 60px;
  height: 60px;
  padding: 0;
  
`


const HamburgerMenuContainer = styled.div`
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  background-color: white;
  z-index: 10;
  transform: translateX(200%);
  transition: transform 0.3s;
  ${props => props.isOpen && `transform: translateX(0);`}

  @media screen and (min-width: 1024px) {
    display: none;
  }
`

const HamburgerHeader = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  justify-content: space-between;
  padding-left: 24px;
  border-bottom: 1px solid #eee;
`
const HamburgerMenu = styled.div`
  padding-left: 24px;
  height: 60px;
  display: flex;
  align-items: center;
  color: ${MENU_DEFAULT_COLOR};
  
  ${props => props.$selected ? `
    color: ${SELECTED_MENU_COLOR};
    font-weight:bold;
  ` : ``
  };
  
`

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
`
export default props => {
  const [isOpen, setIsOpen] = useState(false)
  const onClose = () => {
    setIsOpen(false)
  }

  const onOpen = () => {
    setIsOpen(true)
  }

  return (
    <HamburgerButtonWrap>
      <HamburgerButton $type='empty' onClick={onOpen}>
        <span className='material-icons'>menu</span>
      </HamburgerButton>
      
          <>
            <HamburgerMenuContainer isOpen={isOpen}>
              <HamburgerHeader>
                <div>메뉴</div>
                <button style={{width: 60, height: 60}} onClick={onClose}>
                  <span className='material-icons'>close</span>
                </button>
              </HamburgerHeader>
              {
                MENUS.map(menu => {
                  console.log('selected : ', menu.link === location.pathname)
                  return (
                    <HamburgerMenu
                      as={Link}
                      key={menu.title} 
                      to={menu.link}
                      $selected={menu.link === location.pathname}
                    >
                      {menu.title}
                    </HamburgerMenu>
                  )
                })
              }
            </HamburgerMenuContainer>
            {
              isOpen && (
                <Background onClick={onClose}/>
              )
            }
          </>
    </HamburgerButtonWrap>
  )
}