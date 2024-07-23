import React from 'react'
import styled from 'styled-components'
import TopBar from '../atomic/atoms/TopBar'
import BaseImage from '../atomic/atoms/BaseImage'

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
`
const Wrap = styled.div`
  display : flex;

`

const menu = {data : ["Home", "Profile", "Partner", "History", "Logout"]}

export default props => {
  return (
    <TopBar>
      <LogoContainer>
        <Logo />
        <LogoName>LingoBell</LogoName>
        </LogoContainer>
        <Wrap>
          { menu.data.map(item => 
            <MenuTab>{item}</MenuTab>
          )
          }   
        </Wrap>
    </TopBar>
  )
}