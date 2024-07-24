import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../atoms/Button';

const Background = styled.div`
    background-color: gray;
    width: 100vw;
    height: 100vh;
    opacity: 80%;
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
    z-index: 1;
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

                    <Button>{bttnTxt}</Button>
                </ModalBox>
            </Background>
        )
    );
}



