import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import ProfileItem from '../molecules/ProfileItem'

import ChatCard from '../templates/ChatSectionCard'
import ChatForm from '../molecules/ChatForm'
import { AI_SAMPLE_DATA, PROFILE_DATA, USER_SAMPLE_DATA } from '../../../consts/sampleData'
import { useLocation, useHistory, useNavigate, useParams } from 'react-router-dom'
import ChatHistoryList from '../organisms/ChatHistoryList'
import ChatHistoryDetail from '../organisms/ChatHistoryDetail'
import { getChatRooms } from '../../../apis/ChatAPI'


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
  transition: transform 0.3s;
  ${props => props.isOpen && `
    transform: translateX(0);
  `}
  @media screen and (min-width: 1024px) {
    display: none;
    transform: translateX(0);
    position: static;
    flex: 1;
    width: auto;
    height: auto;
    ${props => props.isOpen && 'display: block;'}
  }
`

const profiles = PROFILE_DATA


export default props => {
  const {
    chatId
  } = useParams()

  const [chatHistoryList, setChatHistoryList] = useState([])

  const fetchChatHistory = async () => {
    try {
      const result = await getChatRooms()
      
      console.log('result?')
      console.log(result)
      setChatHistoryList(result)
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
      <ChatHistoryList chatHistoryList={chatHistoryList} />
      <HistorySectionContainer 
        isOpen={isChatDetailOpen}
      >
        <ChatHistoryDetail />
      </HistorySectionContainer>
    </Container>
  )
}