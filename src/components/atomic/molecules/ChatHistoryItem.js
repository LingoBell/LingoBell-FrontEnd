import React from 'react'
import styled from 'styled-components'
import { Paragraph, Title } from '../atoms/Typograpy'
import BaseImage from '../atoms/BaseImage'
const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
`

const StyledImage = styled(BaseImage)`
  height: 60px;
  width: 60px;
`
const Wrap = styled.div`
  padding-left: 12px;

`

const StyledTitle = styled(Title)`
  font-size: 16px;
  font-weight: bold;
  
`
const StyledParagraph = styled(Paragraph)`
  font-size: 16px;
  margin-top: 4px;
  font-weight: 400;
`
export default props => {
  return (
    <Container>
      <StyledImage src={props.src} />
      <Wrap>
        <StyledTitle>{props.title}</StyledTitle>
        <StyledParagraph>{props.paragraph}</StyledParagraph>
      </Wrap>
    </Container>
  )
}