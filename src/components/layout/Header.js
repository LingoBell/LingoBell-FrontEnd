import React from 'react'
import styled from 'styled-components'
import TopBar from '../atomic/atoms/TopBar'
import BaseImage from '../atomic/atoms/BaseImage'
import { useDispatch, useSelector } from 'react-redux'
import { signOutAll } from '../../redux/userSlice'
import { Link, useLocation } from 'react-router-dom'
import HamburgerMenu from './HamburgerMenu'
import { MENU_DEFAULT_COLOR, SELECTED_MENU_COLOR } from '../../consts/color'

const HeaderContainer = styled.header`
  z-index : 10;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  background-color: white;
`


const LogoContainer = styled.div`
  display : flex;
  align-items: center;
  
  

`
const Logo = styled(BaseImage)`
  width : 40px;
  height : 40px;
  margin-left : 16px;
  background-image: url("./logoIcon.png");
`
const LogoName = styled.div`
  font-size : 28px;
  // margin-top : 8px;
  margin-left : 12px;

`
const MenuTab = styled.div`
  margin-right : 30px;
  border-bottom: 0;
  text-decoration: none;
  font-size: 16px;
  color: ${MENU_DEFAULT_COLOR};
  ${props => props.$selected ? `
    color: ${SELECTED_MENU_COLOR};
    
    font-weight:bold;
  ` : ``
  };
  &:visited {
    color: inherit;
  }
`
const Wrap = styled.div`
  
  
  @media screen and (max-width: 1024px) {
    display: none;
  }
  display : flex;

`

export const MENUS = [
  { title: "Home", link: '/' },
  { title: "Profile", link: '/' },
  { title: "Partner", link: '/partners' },
  { title: "History", link: '/chat-history' },
  { title: "Logout", link: '/' },

]
export default props => {
  const dispatch = useDispatch()
  const {isLoginUser, isFirstLogin } = useSelector((state) => {
    return {isLoginUser : state.user?.user,
            isFirstLogin : state.user.isFirstLogin
    }
  })
  console.log('dddddd',isFirstLogin)
  const trySignout = () => {
    dispatch(signOutAll())
  }

  const location = useLocation()
  return (
    <HeaderContainer>
    
      <TopBar>
        <LogoContainer as={Link} to='/'>
          
          <Logo />
          <LogoName>LingoBell</LogoName>
          
        </LogoContainer>
        {
          isLoginUser && (
            <>
              <HamburgerMenu/>
              <Wrap>
                { 
                  MENUS.map(menu => {
                    if(isFirstLogin == 3 && menu.title != 'Logout') {
                      return null
                    }
                     
                    if (menu.title == 'Logout') {
                      return (
                        <MenuTab
                          key={menu.title} 
                          onClick={trySignout} 
                        >
                          {menu.title}
                        </MenuTab>
                      )
                    }
                    return (
                      <MenuTab 
                        as={Link} 
                        key={menu.title} 
                        to={menu.link}
                        $selected={menu.link == location.pathname}
                      >
                        {menu.title}
                      </MenuTab>
                    )
                  })
                }   
              </Wrap>
            </>
          )
        }
      </TopBar>
    </HeaderContainer>
  )
}