import React from 'react'
import styled from 'styled-components'
import Button from '../atoms/Button'
import { Title, Paragraph } from '../atoms/Typograpy'
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-left: 16px;
  padding-right: 16px;
  @media screen and (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
  @media screen and (min-width: 1100px) {
    max-width: 1024px;
    margin-left: auto;
    margin-right: auto;
  }
`

const ImageWrap = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  > img {
    max-width: 350px;
  }
  @media screen and (min-width: 768px) {
    order: 2;
    
    > img {
      max-width: none;
    }
  }
  @media screen and (min-width: 1100px) {
    justify-content: flex-end;
  }
`

const ContentFullWrap = styled.div`
  @media screen and (min-width: 768px) {
    order: 1;
    max-width: 400px;
  }
`

const ContentWrap = styled.div`
  
  line-height: 1.4;
`

const StyledTitle = styled(Title)`
  font-size: 28px;
`

const StyledParagraph = styled(Paragraph)`
  font-size: 28px;
`


const ButtonWrap = styled.div`
  padding-bottom: 24px;
  padding-top: 48px;
`
const StyledButton = styled(Button)`
  height: 40px;
  width: 100%;
  font-size: 14px;
  margin-bottom: 12px;

`
export default props => {
  return (
    <Container>
      <ImageWrap>
        <img width='80%' src='/indexImage.png' />
      </ImageWrap>
      <ContentFullWrap>
        <ContentWrap>
          <StyledTitle>Welcome to LingoBell</StyledTitle>
          <StyledParagraph>Your AI assistant for language exchange</StyledParagraph>
        </ContentWrap>
        <ButtonWrap>
          <StyledButton $type='bordered'>구글 계정으로 로그인</StyledButton>
          <StyledButton $type='black'>이메일로 로그인하기</StyledButton>
          <StyledButton>회원 가입</StyledButton>
        </ButtonWrap>
      </ContentFullWrap>
      
    </Container>
  )
}