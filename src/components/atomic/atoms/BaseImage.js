import React from 'react'
import styled from 'styled-components'

const BaseImage = styled.div`
  background-color: rgba(217, 217, 217, 0.5);
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: 50%;
  border-radius: 50%;
  
`

export const Tag = styled.div`
  background-color: #ccc;
  padding: 2px 4px;
  color: #000;
`

export default BaseImage
