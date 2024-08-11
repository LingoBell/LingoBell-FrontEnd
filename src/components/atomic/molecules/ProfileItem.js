import React, { forwardRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import BaseImage, { Tag } from '../atoms/BaseImage'
import { Paragraph, Title } from '../atoms/Typograpy'
import LanguageGauge from './LanguageGauge'
import Flag from 'react-world-flags'
import { calculateAge } from '../../../consts/calculateAge'
import Button from '../atoms/Button'
import { useNavigate, useParams } from 'react-router-dom'
import Modal from './Modal'


const Container = styled.div`
  min-widht : 400px;
  display : flex;
  align-items: center;
  justify-content : space-between;
`
const ProfileImage = styled(BaseImage)`
  position : relative;
  width : 100px;
  min-width : 100px;
  height : 100px;
  .small & {
    min-width: 60px;
    width: 60px;
    height: 60px;
  }
`

const FlagContainer = styled.div`
  position : absolute;
  bottom : 0;
  width : 32px;
  height : 32px;
  border-radius : 50%;
  display : flex;
  justify-content : center;
  align-items : center;
  overflow : hidden;

  ${props => props.$isSmall == 'small' && `
      width : 26px;
      height : 26px;
    `}
`
const RoundFlag = styled(Flag)`
  width : auto;
  height : auto;
  min-height : 100%;
`
const Wrap = styled.div`
  margin-top : auto;
  margin-bottom: auto;
  padding-left : 12px;
  line-height : 1.5;
  
`
const UserName = styled(Title)`
  font-weight : 550;
  font-size : 22px;
  .small & {
    font-size: 16px;
  }
`
const StyledTag = styled(Tag)`
  white-space : nowrap;
  font-size : 12px;
  margin-top : 6px;
  margin-right : 6px;
  padding : 2px 4px 2px 4px;
  .small & {
    display: none;
  }
`

const StyledParagraph = styled(Paragraph)`
  padding-top : 12px;
  word-break : break-all;
  font-weight: light;
  
`
const TagWrap = styled.div`
  display : flex;
  flex-wrap : wrap;
  margin-top : 4px;
`
const NameWarp = styled.div`
  display : flex;
  align-items : center;
  `
const AgeBox = styled.div`
  color : white;
  border-radius : 8px;
  display : flex;
  justify-content : center;
  align-items : center;
  padding : 0 8px 0 8px;
  font-size : 16px;
  margin-left : 10px;
  height : 24px;
  ${props => props.$isSmall == 'small' && `
    scale : 0.9;
    `}

  ${props => props.$gender == 'Male' && `
    background-color : #7086F3;
    `}

  ${props => props.$gender == 'Female' && `
    background-color : #EB469B;
    `}
`

const Gender = styled.div`
  padding-right : 2px;
  padding-left : 2px;
`

const Age = styled.div`
  padding-right : 2px;
  padding-left : 2px;

`
const ProfileWrap = styled.div`
  display : flex;
  padding-right : 12px;
  @media screen and (max-width : 600px) {
    scale : 0.8;
  }
`
const StyledButton = styled(Button)`
  margin-right : 12px;
`
const UserState = styled.div`
${props => props.$type == 'online' && `
  color : green;
  `}
${props => props.$type == 'offline'&& `
  color : grey;
  `}
${props => props.$type == undefined &&`
  color : grey;
  `}
`


export default props => {
  const [historyModal, setHistoryModal] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState()
  const navigate = useNavigate()
  const chatId = useParams()

  const handleCloseModal = () => {
    setHistoryModal(false);

  };

  const {
    onClick,
    handleClick,
    size,
    hideContent,
    enterChatRoom,
  } = props;

  useEffect(()=>{
    setSelectedProfile(props)
  },[props])

  // useEffect(()=>{
  //   const userRef = ref(database, '/users');
  //   onValue(userRef, (snapshot) => {
  //     const data = snapshot.val();
  //     if(data){
  //       setUserStatus(data[props.userCode])
  //     }
  //   })
  // },[])


  // setTimeout(()=>{
  //   console.log('dwdw',userStatus)
  // },300)

  return (
    <Container className={[(size === 'small' ? 'small' : ''), props.className].join(' ')} onClick={onClick || handleClick}>
      {historyModal && (
        <Modal
          isOpened={historyModal}
          onClickCloseBtn={() => handleCloseModal()}
          bttnTxt="Request Language Exchange"
          selectedProfile={selectedProfile}
          onClickButton={() => {
            navigate(`/live-chat/${chatId.chatId}`)

          }}
        />
      )}
      <ProfileWrap>
        <ProfileImage src={props.profileImages ? props.profileImages
          : 'https://storage.googleapis.com/lingobellstorage/lingobellLogo.png'}>
          <FlagContainer $isSmall={props.isSmall}>
            <RoundFlag code={props?.nation} />
          </FlagContainer>
        </ProfileImage>
        <Wrap>

        {props.userStatus === 'online' && (
          <UserState $type={props.userStatus} >
            <span>&#9679;</span>online
          </UserState>
        )} 
        {props.userStatus === 'offline' &&(
          <UserState $type={props.userStatus}>
              <span>&#9679;</span>offline
            </UserState>
        )}
        {props.userStatus === undefined &&(
          <UserState $type={props.userStatus}>
              <span>&#9679;</span>offline
            </UserState>
        )}
        
          <NameWarp>
            <UserName>{props?.userName}</UserName>
            <AgeBox $gender={props?.gender}
              $isSmall={props?.isSmall}>
              <Gender>
                {props?.gender == 'Male' ? '♂' : '♀'}
              </Gender>
              <Age>
                {calculateAge(props?.birthday)}
              </Age>
            </AgeBox>
          </NameWarp>
          <LanguageGauge //언어 + 레벨 게이지 컴포넌트
            nativeLanguage={props?.nativeLanguage}
            learningLanguages={props?.learningLanguages}
          />

          <TagWrap>
            {props.interests?.map(interest =>   // tags라는 데이터
              <StyledTag>{interest}</StyledTag>
            )}
          </TagWrap>

          {
            hideContent && (
              <>
                <StyledParagraph>{props.content}</StyledParagraph>
                {props.children}
              </>
            )
          }
        </Wrap>
      </ProfileWrap>
      {enterChatRoom == 'true' && (
        <StyledButton $type='bordered-filled'
          onClick={() => {
            setHistoryModal(true)
          }}
        >Show Detail</StyledButton>
      )}
    </Container>

  )
}