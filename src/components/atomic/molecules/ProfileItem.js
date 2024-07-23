import React, { useState } from 'react'
import styled from 'styled-components'
import BaseImage, { Tag } from '../atoms/BaseImage'
import { Paragraph, Title } from '../atoms/Typograpy'

const Container = styled.div`
  display : flex;
  border : 1px solid #ccc;
  padding-top : 12px;
  padding-bottom : 12px;
  margin-left: 12px;
  margin-right: 12px;
`
const ProfileImage = styled(BaseImage)`
  width : 100px;
  height : 100px;
  margin-left : 20px;
`
const Wrap = styled.div`
  margin-top : auto;
  margin-bottom: auto;
  margin-left : 40px;
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


export default props => {
  const { onClick } = props;
  

  return (
    <Container onClick={onClick || handleClick}>
      <ProfileImage src={props.src} />
      <Wrap>
        <UserName>{props.title}</UserName>
        <div style={{ display: 'flex' }}>
          {props.tags?.map(tag =>   // tags라는 데이터
            <StyledTag>{tag}</StyledTag>
          )}
        </div>
        <Paragraph>{props.content}</Paragraph>
        {props.children}
      </Wrap>
    </Container>
  )
}