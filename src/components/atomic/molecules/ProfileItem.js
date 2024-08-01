import React, { useState } from 'react'
import styled from 'styled-components'
import BaseImage, { Tag } from '../atoms/BaseImage'
import { Paragraph, Title } from '../atoms/Typograpy'

const Container = styled.div`
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
  font-size : 12px;
  margin-right : 6px;
  padding : 2px 4px 2px 4px;
  .small & {
    display: none;
  }
`

const StyledParagraph = styled(Paragraph)`

  word-break : break-all;
  font-weight: light;
  
`

export default props => {
  const { 
    onClick, 
    handleClick, 
    textEllipsis, 
    size,
    hideContent = false
  } = props;
  

  return (
    <Container className={[(size === 'small' ? 'small' : ''), props.className].join(' ')} onClick={onClick || handleClick}>
      <ProfileImage src={props.src} />
      <Wrap>
        <UserName>{props.title}</UserName>
        <UserName>{props.content}</UserName>
        <UserName>{props.chatDescription}</UserName>
        <div style={{ display: 'flex' }}>
          {props.tags?.map(tag =>   // tags라는 데이터
            <StyledTag>{tag}</StyledTag>
          )}
        </div>

        {
          !hideContent && (
            <>
              <StyledParagraph  $type="word-break" textEllipsis={textEllipsis}>{props.content}</StyledParagraph>
              {props.children}
            </>
          )
        }
      </Wrap>
    </Container>
  )
}