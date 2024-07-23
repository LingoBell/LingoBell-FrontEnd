import React, { Children } from 'react'
import styled from 'styled-components'
import Input from '../atoms/Input'
import { Title } from '../atoms/Typograpy'


  const Container = styled.div`
`
const FormTitle = styled(Title)`

`



export default props => {
  return (
    <Container>
      <FormTitle>{props.title}</FormTitle>
      {props.children}
    </Container>
  )
}