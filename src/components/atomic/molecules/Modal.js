import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../atoms/Button';

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
    const {onClickCloseBtn, isOpened, onClickAlertBtn} = props;

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
                    <Button onClick={onClickAlertBtn}>버튼</Button>

                </ModalBox>


            </Background>
        )
    );
}



