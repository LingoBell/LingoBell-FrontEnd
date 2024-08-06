import React from 'react'
import styled from 'styled-components'
import { AI_SAMPLE_DATA, PROFILE_DATA, USER_SAMPLE_DATA } from '../../../consts/sampleData'
import ChatCard from '../templates/ChatSectionCard'
import ChatForm from '../molecules/ChatForm'
import ProfileItem from '../molecules/ProfileItem'
const HistorySection = styled.div`
  height: 100%;
    
  display: flex;
  flex-direction: column;
  @media screen and (min-width: 1024px) {
    background-color: white;
    margin-left: auto;
    margin-right: auto;
    
    padding: 24px;
    max-width: 950px;
    
  }
  
`

const StyledChatCard = styled(ChatCard)`
  padding: 4px;
  @media screen and (max-width: 1023px) {
    border: 0;
    border-radius: 0;
    min-height: 68px;
  }
  @media screen and (min-width: 1024px) {
    padding: 16px;
    margin-left: 24px;
    margin-right: 24px;
    

  }
  
  
`
const ChatWrap = styled.div`
  @media screen and (min-width: 600px) {
    display: flex;
    margin-top: 24px;
    padding-left: 12px;
    padding-right: 12px;
    align-items: center;
    flex: 1;
  }
`

const UserChatForm = styled(ChatForm)`
  @media screen and (max-width: 599px) {
    border: 0;
    border-radius: 0;
  }
  @media screen and (min-width: 600px) {
    height: 100%;
    margin-right: 12px;
    margin-left: 12px;
    flex: 1;
  }
  @media screen and (min-width: 1024px) {
  }
`

const AIChatForm = styled(UserChatForm)`
`

export default props => {
  const secondProfile = PROFILE_DATA[0]

  const {
    // userName,
    // image: ssrc,
    // language: stags,
    // selfIntroduction: scontent
  } = secondProfile

  return (
    <HistorySection>
          
      <StyledChatCard>
        <ProfileItem
          
          // userName={userName}
          // src={ssrc}
          // tags={stags}
          // content={scontent}
          // textEllipsis
        />
      </StyledChatCard>
      <ChatWrap>
        <UserChatForm data={USER_SAMPLE_DATA} />
        <AIChatForm data={AI_SAMPLE_DATA} />
      </ChatWrap>
    </HistorySection>
  )
}