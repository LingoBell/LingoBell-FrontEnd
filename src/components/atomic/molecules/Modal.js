import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../atoms/Button';
import ProfileItem from './ProfileItem';
import { interests } from '../../../consts/profileDataKeyList';

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
    z-index : 2;
`

const ModalBox = styled.div`
    min-width : 400px;
    position: relative;
    background-color: white;
    padding-bottom : 24px;
    border-radius : 8px;
    padding-top: 24px;
    z-index: 1;
    overflow: hidden;
`
const ModalProfileItem = styled(ProfileItem)`
  padding : 12px 12px;
  margin : 12px 12px;
  max-width : 500px;
  `

const ButtonWrap = styled.footer`
    display: flex;
    justify-content: center;
`

const TestButton = styled(Button)`
    width : calc(80% - 24px);
`

export default props => {
    const { 
        onClickCloseBtn, 
        isOpened, 
        bttnTxt, 
        selectedProfile,
        onClickButton,
    } = props;

    return (
        isOpened && (
            <Background onClick={onClickCloseBtn}>
                <ModalBox onClick={e => e.stopPropagation()} >
                    <button style={{width: 60, height: 50, position: 'absolute', top: 0, right: 0}}>
                        <span
                            className='material-icons'
                            onClick={onClickCloseBtn}
                            style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}
                        >
                            close
                        </span>
                    </button>
                    {props.children}
                    <div>
                        <ModalProfileItem
                            userName={selectedProfile.userName}
                            profileImages={selectedProfile.profileImages}
                            gender = {selectedProfile.gender}
                            birthday = {selectedProfile.birthday}
                            interests = {selectedProfile.interests}
                            learningLanguages = {selectedProfile.learningLanguages}
                            nation = {selectedProfile.nation}
                            nativeLanguage = {selectedProfile.nativeLanguage}
                            content={selectedProfile.description}
                            hideContent = {true}
                        />
                        <ButtonWrap>
                            <TestButton onClick={onClickButton}>{bttnTxt}</TestButton>
                        </ButtonWrap>
                    </div>
                </ModalBox>
            </Background>
        )
    );
}



