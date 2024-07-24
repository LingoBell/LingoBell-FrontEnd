import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { PRIMARY_COLOR } from '../../../consts/color'

const buttonTypes = {
  bordered: `
    border: 1px solid #000;
    color: black;
    background-color: white;
  `,
  'bordered-filled': `
    border: 1px solid #000;
    color: black;
    background-color: white;
    &:hover {

      background-color: ${PRIMARY_COLOR};
      color: white;
    }
  `,
  black: `
    background-color: black;
    color: white;
  `,
  empty: `
    color: black;
    background-color: transparent;
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
  cursor: pointer;
  ${props => buttonTypes[props.$type]}

`

Button.propTypes = {
  $type: PropTypes.oneOf(['bordered', 'bordered-filled'])
}

export default Button