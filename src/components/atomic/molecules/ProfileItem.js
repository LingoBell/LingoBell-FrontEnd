import React, { useState } from 'react'
import styled from 'styled-components'
import BaseImage, { Tag } from '../atoms/BaseImage'
import { Paragraph, Title } from '../atoms/Typograpy'
import LanguageGauge from './LanguageGauge'

const Container = styled.div`
  min-widht : 400px;
  display : flex;
  align-items: center;
`
const ProfileImage = styled(BaseImage)`
  width : 100px;
  min-width : 100px;
  height : 100px;
  .small & {
    min-width: 60px;
    width: 60px;
    height: 60px;
  }
`
const Wrap = styled.div`
  margin-top : auto;
  margin-bottom: auto;
  padding-left : 12px;
  line-height : 1.5;
  
`
const UserName = styled(Title)`
  font-weight : bold;
  font-size : 24px;
  .small & {
    font-size: 16px;
  }
`
const StyledTag = styled(Tag)`
  white-space : nowrap;
  font-size : 12px;
  margin-top : 6px;
  margin-right : 6px;
  padding : 2px 4px 2px 4px;
  .small & {
    display: none;
  }
`

const StyledParagraph = styled(Paragraph)`
  padding : 12px;
  word-break : break-all;
  font-weight: light;
  
`
const TagWrap = styled.div`
  display : flex;
  flex-wrap : wrap;
  margin-top : 4px;
`

export default props => {
  const { 
    onClick, 
    handleClick, 
    textEllipsis, 
    size,
    hideContent,
  } = props;
  
  return (
    <Container className={[(size === 'small' ? 'small' : ''), props.className].join(' ')} onClick={onClick || handleClick}>
      <ProfileImage src={props.src} />
      <Wrap>
        <UserName>{props.userName}</UserName>
        <LanguageGauge //언어 + 레벨 게이지 컴포넌트
          nativeLanguage = {props.nativeLanguage}
          learningLanguages = {props.learningLanguages}
          />

          <TagWrap>
          {props.interests?.map(interest =>   // tags라는 데이터
            <StyledTag>{interest}</StyledTag>
          )}
          </TagWrap>

        {
          hideContent && (
            <>
              <StyledParagraph>{props.content}</StyledParagraph>
              {props.children}
            </>
          )
        }
      </Wrap>
    </Container>
  )
}