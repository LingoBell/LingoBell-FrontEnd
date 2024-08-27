import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { AI_SAMPLE_DATA, PROFILE_DATA, USER_SAMPLE_DATA } from '../../../consts/sampleData'
import ChatCard from '../templates/ChatSectionCard'
import ChatForm from '../molecules/ChatForm'
import ProfileItem from '../molecules/ProfileItem'
import { useParams } from 'react-router-dom'
import { getChatRoomsById, GetRecommendations, getSttAndTranslatedMessages } from '../../../apis/ChatAPI'
import { user_online_status } from '../../../firebase/firebase'
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
@media screen and (max-width : 599px) {
  width : calc(100% - 48px);
  margin-left : auto;
  margin-right : auto;
  }
@media screen and (min-width: 600px) {
    padding : 16px;
    margin-left : auto;
    margin-right : auto;
    min-width : calc(100% - 48px);
    border-radius: 6px;
    min-height: 68px;
  }
  @media screen and (min-width: 1024px) {
    padding: 16px;
    margin-left: 24px;
    margin-right: 24px;
  }  
`

const ChatWrap = styled.div`
    display: flex;
    flex-direction : column;
    margin-top: 24px;
    padding-left: 12px;
    padding-right: 12px;
    align-items: center;
    flex: 1;
    overflow : hidden;
  @media screen and (min-width: 600px) {
    display: flex;
    flex-direction : row;
    margin-top: 24px;
    padding-left: 12px;
    padding-right: 12px;
    align-items: center;
    flex: 1;
    overflow : hidden;
  }
`

const UserChatForm = styled(ChatForm)`
  height : 100%;
  width : calc(100% - 24px);
  @media screen and (max-width: 599px) {
    // border: 0;
    border-radius: 6px;
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
`

export default props => {
  const { chatId: chatRoomId } = useParams()
  const [data, setData] = useState();
  const [recommendation, setRecommendation] = useState([])
  const [messages, setMessages] = useState([]);
  const lastMessageRef = useRef(null);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const fetchAiRecommendations = async () => {
    const recommendData = await GetRecommendations(chatRoomId);
    const newRecommendData = recommendData.map(item => ({
      ...item, type: 'ai'
    }))
    console.log('newRecommendData:', newRecommendData)
    setRecommendation(newRecommendData)
  }

  const fetchChatDataById = async (chatRoomId) => {
    try {
      const userState = await user_online_status();
      const result = await getChatRoomsById(chatRoomId)
      const userStatus = userState[result.userCode]?.status?.state;
      const newResult ={
        ...result,
        userStatus : userStatus
      }
      setData(newResult)
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  const fetchSttAndTranslatedMessages = async (chatRoomId) => {
    try {
      const data = await getSttAndTranslatedMessages(chatRoomId);
      console.log("fetchSttAndTranslatedMessages result", data);
      setMessages(data.messages);
    } catch (error) {
      console.log("Error occured while fetchSttAndTranslatedMessages on ChatHistoryDetail");
    }
  };

  useEffect(() => {
    if (chatRoomId) {
      fetchChatDataById(chatRoomId)
      fetchSttAndTranslatedMessages(chatRoomId)
    }
  }, [chatRoomId])

  useEffect(() => {
    if (chatRoomId) {
      fetchAiRecommendations(chatRoomId)
    }
  }, [chatRoomId])

  useEffect(() => {
    if (isFirstRender && lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
      setIsFirstRender(false); // 첫 렌더링 이후로는 자동 스크롤 비활성화
    }
  }, [messages]);

  console.log('dwdwdd', recommendation)
  console.log("messages", messages);

  return (
    <HistorySection>
      <StyledChatCard>
        <HistoryProfileItem
          {...data}
          enterChatRoom='true'
        />
      </StyledChatCard>
      <ChatWrap>
        <AIChatForm data={recommendation} />
        <div style={{height : '36px'}}></div>
        <UserChatForm 
          data={messages}
          lastMessageRef={lastMessageRef} 
        />
      </ChatWrap>
    </HistorySection>
  )
}