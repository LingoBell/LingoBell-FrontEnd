import React from 'react'
import styled from 'styled-components'
export const Title = styled.div`
  color: #333;
  font-weight: bold;
`


const textTypes = {
  ellipsis: `
    text-overflow: ellipsis;
    // white-space:nowrap;

  `,
  'word-break' : `
     word-break : break-all;
  `
}

export const Paragraph = styled.div`
  color: rgba(51,51,51, 0.8);
    ${props => textTypes[props.$type]}
`

