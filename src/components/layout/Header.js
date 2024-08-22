import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import TopBar from '../atomic/atoms/TopBar'
import BaseImage from '../atomic/atoms/BaseImage'
import { useDispatch, useSelector } from 'react-redux'
import { signOutAll } from '../../redux/userSlice'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import HamburgerMenu from './HamburgerMenu'
import { MENU_DEFAULT_COLOR, PRIMARY_COLOR, SELECTED_MENU_COLOR } from '../../consts/color'
import { getMyProfile } from '../../apis/UserAPI'

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
  justify-content : center;

  
  

`
const Logo = styled.img`
  width : 45px;
  height : 45px;
  margin-left : 14px;
`
const LogoName = styled.div`
  font-size : 28px;

`
const MenuTab = styled.div`
  margin-right : 30px;
  border-bottom: 0;
  text-decoration: none;
  font-size: 16px;
  cursor : pointer;
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
  align-items : center;

`

const UserName = styled.div`
  display : flex;
  align-items : center;
  padding-right : 30px;

  img{
    width : 26px;
  }
`

export const MENUS = [
  { title: "Home", link: '/' },
  { title: "Profile", link: '/profile' },
  { title: "Partner", link: '/partners' },
  { title: "Logout", link: '/' },

]
export default props => {
  const [userName, setUserName] = useState('')
  const [userPic, setUserPic] = useState('')
  const dispatch = useDispatch()
  const {isLoginUser, isFirstLogin } = useSelector((state) => {
    return {isLoginUser : state.user?.user,
            isFirstLogin : state.user.isFirstLogin
    }
  })
  console.log('dddddd',isFirstLogin)
  const navigate = useNavigate()

  const trySignout = () => {
    dispatch(signOutAll())
    window.location.reload()
  }


  useEffect( async()=>{
   const getUserName = await getMyProfile()
   if (getUserName) {
     setUserName(getUserName.userName)
     setUserPic(getUserName.profileImages)
   }

  },[])


  const location = useLocation()
  return (
    <HeaderContainer>
    
      <TopBar>
        <LogoContainer as={Link} to='/'>
          
          <Logo src = 'https://storage.googleapis.com/lingobellstorage/lingobellLogo.png'/>
          <LogoName>LingoBell</LogoName>
          
        </LogoContainer>
        
        {
          isLoginUser && (
            <>
              <HamburgerMenu/>
              <Wrap>
                <UserName>
                 Welcome &nbsp; <span style={{fontWeight : '550', color : PRIMARY_COLOR}}>{userName ? userName : 'New user'}</span>
                <img src='https://storage.googleapis.com/lingobellstorage/lingobellLogo.png'></img>
                </UserName>
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