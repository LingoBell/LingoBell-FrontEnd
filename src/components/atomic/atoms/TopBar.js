import React from 'react'
import styled from 'styled-components'


const Container = styled.div`
    width : 100%;
    max-width : 1440px;
    margin-left : auto;
    margin-right : auto;
    height : 60px;
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