import React from 'react'
import styled from 'styled-components'


const Container = styled.div`
    width : 100%;
    height : 60px;
    background-color : #eee;
    display : flex;
    justify-content: space-between;
    align-items: center;
`
export default props => {
    return (
        <Container>
            {props.children}
        </Container>
    )
}