import React, { useState } from 'react';
import styled from 'styled-components';

const Background = styled.div`
    background-color: gray;
    width: 100vw;
    height: 100vh;
    opacity: 30%;
    position: fixed;
    left: 0;
    top: 0;

    display: flex;
    align-items: center;
    justify-content: center;
`

const ModalBox = styled.div`
    width: 50vw;
    height: 50vh;
    background-color: white;

    // min-width: 600px;
    z-index: 1;
`

export default props => {
    const [clicked, setClicked] = useState(false);

    const handleCloseBttn = () => {
        setClicked(true);
        console.log("close button clicked!");
    };

    const handleBackgroundClick = () => {
        setClicked(true);
        console.log("background clicked!");
    };

    return (
        !clicked && (
            <Background onClick={() => handleBackgroundClick()}>
                <ModalBox onClick={e => e.stopPropagation()} >
                    <span
                        className='material-icons'
                        onClick={() => handleCloseBttn()}
                        style={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }}
                    >
                        close
                    </span>
                </ModalBox>
            </Background>
        )
    );
}



