import React, { useState } from 'react'
import styled from 'styled-components'
import BaseImage, { Tag } from '../atoms/BaseImage'
import { Paragraph, Title } from '../atoms/Typograpy'

const Container = styled.div`
  display : flex;
`
const ProfileImage = styled(BaseImage)`
  width : 100px;
  min-width : 100px;
  height : 100px;
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
`
const StyledTag = styled(Tag)`
  font-size : 12px;
  margin-right : 6px;
  padding : 2px 4px 2px 4px;
`

const StyledParagraph = styled(Paragraph)`

`

export default props => {
  const { onClick, handleClick } = props;
  

  return (
    <Container className={props.className} onClick={onClick || handleClick}>
      <ProfileImage src={props.src} />
      <Wrap>
        <UserName>{props.title}</UserName>
        <div style={{ display: 'flex' }}>
          {props.tags?.map(tag =>   // tags라는 데이터
            <StyledTag>{tag}</StyledTag>
          )}
        </div>
        <StyledParagraph $type="word-break">{props.content}</StyledParagraph>
        {props.children}
      </Wrap>
    </Container>
  )
}