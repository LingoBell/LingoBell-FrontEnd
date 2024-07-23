import React from 'react'
import styled from 'styled-components'
import Header from './Header'
import Main from './Main'
import { Outlet } from 'react-router-dom'
export default props => {
  return (
    <>
      <Header />
      <Main>
        <Outlet />
      </Main>

    </>
  )
}