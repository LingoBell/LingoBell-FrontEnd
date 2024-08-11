import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import ProfileItem from '../molecules/ProfileItem'
import ChatCard from '../templates/ChatSectionCard'
import ChatForm from '../molecules/ChatForm'
import { useLocation, useHistory, useNavigate, useParams } from 'react-router-dom'
import ChatHistoryList from '../organisms/ChatHistoryList'
import ChatHistoryDetail from '../organisms/ChatHistoryDetail'
import { getChatRooms } from '../../../apis/ChatAPI'
import { PRIMARY_COLOR } from '../../../consts/color'
import { user_online_status } from '../../../firebase/firebase'

const Container = styled.div`
  display: flex;
  height: 100%;
`

const HistorySectionContainer = styled.main`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateX(200%);
  background-color: white;
  background-repeat : no-repeat;
  transition: transform 0.3s;
  ${props => props.isOpen && `
    transform: translateX(0);
  `}
  @media screen and (min-width: 1024px) {
    transform: translateX(0);
    position: static;
    flex: 1;
    width: auto;
    height: auto;
    min-height: calc(100vh - 60px);
    ${props => props.isOpen && 'display: block;'}
  }
`

const ChatLogo = styled.div`
    display : flex;
    justify-content : center;
    flex-direction : column;
    align-items : center;
    height : 100%;
    img {
      width : 250px;
      opacity : 1;
    }
    
    div { 
    font-size : 34px;
    margin-top : 80px;
    color : ${PRIMARY_COLOR};
    }
`

export default props => {
  const {
    chatId
  } = useParams()

  const [chatHistoryList, setChatHistoryList] = useState([])

  const fetchChatHistory = async () => {
    try {
      const userState = await user_online_status();
      const result = await getChatRooms();
      const newResult = result.map(result => {
        const userStatus = userState[result.userCode]?.status?.state;
        return{
          ...result, userStatus : userStatus
        }
      })
      setChatHistoryList(newResult)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchChatHistory()
  }, [])


  const isChatDetailOpen = !!chatId
  return (
    <Container>
      <ChatHistoryList chatHistoryList={chatHistoryList}/>
      <HistorySectionContainer 
        isOpen={isChatDetailOpen}
      >
        {
          isChatDetailOpen ? (
            <ChatHistoryDetail />
          ) : (
            <>
            <ChatLogo>
            <img src='https://storage.googleapis.com/lingobellstorage/chat-logo.png'/>
            <div>No chats selected</div>
            </ChatLogo>
            </>
          )
        }
      </HistorySectionContainer>
    </Container>
  )
}