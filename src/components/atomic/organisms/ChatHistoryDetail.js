import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { AI_SAMPLE_DATA, PROFILE_DATA, USER_SAMPLE_DATA } from '../../../consts/sampleData'
import ChatCard from '../templates/ChatSectionCard'
import ChatForm from '../molecules/ChatForm'
import ProfileItem from '../molecules/ProfileItem'
import { useParams } from 'react-router-dom'
import { getChatRoomsById, GetRecommendations } from '../../../apis/ChatAPI'
const HistorySection = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 70px;
  padding-bottom: 24px;
  @media screen and (min-width: 1024px) {
    background-color: white;
    margin-left: auto;
    margin-right: auto;
    padding: 24px;
    max-width: 950px;
    overflow-y : hidden;
    height: calc(100vh - 60px);
    
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
    overflow : hidden;
  }
`

const UserChatForm = styled(ChatForm)`
  height : 450px;
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
const HistoryProfileItem = styled(ProfileItem)`
  justify-content : center;
`

const AIChatForm = styled(UserChatForm)`
  // height : 450px;
`

export default props => {
  const { chatId: chatRoomId } = useParams()
  const [data, setData] = useState();
  const [recommendation, setRecommendation] = useState([])

  const fetchAiRecommendations = async () => {
    const recommendData = await GetRecommendations(chatRoomId);
    const newRecommendData = recommendData.map(item => ({
        ...item, type: 'ai'
    }))
    console.log('newRecommendData:', newRecommendData)
    setRecommendation(newRecommendData)
}


  const fetchChatDataById = async (chatRoomId) => {
    try{
      const result = await getChatRoomsById(chatRoomId)
      console.log('hihihi', result)
      setData(result)
    } catch(error){
      console.log('Error: ', error)
    }
  }

  useEffect(()=>{
    if(chatRoomId){
      fetchChatDataById(chatRoomId)
    }

  },[chatRoomId])

  useEffect(()=>{
    if(chatRoomId){
      fetchAiRecommendations(chatRoomId)
    }
  },[chatRoomId])

  console.log('dwdwdd',recommendation)



  return (
    <HistorySection>          
      <StyledChatCard>
        <HistoryProfileItem
      
          {...data}
          enterChatRoom = 'true'
          />
      </StyledChatCard>
      <ChatWrap>
        <AIChatForm data={recommendation} />
        <UserChatForm />
      </ChatWrap>
    </HistorySection>
  )
}