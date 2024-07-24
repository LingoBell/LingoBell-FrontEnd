import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../atoms/Button';

const Background = styled.div`
    background-color: rgba(0,0,0,0.4);
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`

const ModalBox = styled.div`
    background-color: white;
    padding-bottom : 24px;
    border-radius : 8px;
    // min-width: 600px;
    z-index: 1;
`
const TestButton = styled(Button)`
    width : calc(80% - 24px);
    `

export default props => {
    const { onClickCloseBtn, isOpened, bttnTxt } = props;

    return (
        isOpened && (
            <Background onClick={onClickCloseBtn}>
                <ModalBox onClick={e => e.stopPropagation()} >
                    <span
                        className='material-icons'
                        onClick={onClickCloseBtn}
                        style={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }}
                    >
                        close
                    </span>
                    {props.children}
                    <div style={{"textAlign" : "center"}}>
                    <TestButton>버튼</TestButton>
                    </div>

                </ModalBox>
            </Background>
        )
    );
}



