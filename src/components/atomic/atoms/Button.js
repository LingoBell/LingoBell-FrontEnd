import React from 'react'
import styled from 'styled-components'
import { PRIMARY_COLOR } from '../../consts/color'
import PropTypes from 'prop-types'

const buttonTypes = {
  bordered: `
    border: 2px solid #000;
    color: black;
    background-color: white;
  `,
  'bordered-filled': `
    border: 2px solid #000;
    color: black;
    background-color: white;
    &:hover {
      background-color: ${PRIMARY_COLOR};
      color: white;
    }
  `
}


const Button = styled.button`
  /* height: 40px; */
  display: inline-block;
  border-radius: 8px;
  color: white;
  background-color: ${PRIMARY_COLOR};
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 12px;
  padding-bottom: 12px;
  ${props => buttonTypes[props.$type]}

`

Button.propTypes = {
  $type: PropTypes.oneOf(['bordered', 'bordered-filled'])
}

export default Button