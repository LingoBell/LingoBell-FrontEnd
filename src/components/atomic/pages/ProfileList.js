import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import CenteredMainLayout from '../templates/CenteredMainLayout'
import ProfileItem from '../molecules/ProfileItem'
import Modal from '../molecules/Modal'
import { useNavigate } from 'react-router-dom'
import { PROFILE_DATA } from '../../../consts/sampleData'
import { useSelector } from 'react-redux'
import { CreateChat, UpdateChatRoomStatus } from '../../../apis/ChatAPI'
import { GetPartnerList, GetRequestPartnerList } from '../../../apis/PartnerAPI'

// const profiles = PROFILE_DATA

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-top : 12px;
  padding-left : 12px;
  padding-right : 12px;
  @media screen and (min-width: 800px) {
    // justify-content : center;
    flex-direction: row;
    flex-wrap: wrap;

  }
`
const StyledProfileItem = styled(ProfileItem)`
  width : 100%;
  border : 1px solid #ccc;
  padding : 12px 12px;
  margin-top: 12px;
  margin-bottom: 12px;
  @media screen and (min-width : 800px){
    // margin : 
    margin : 12px 12px;
    width : calc(50% - 24px)
  }
`
const PartnersTab = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 12px;
`
const PartnersBtn = styled.button`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  margin: 15px;
  font-size: 20px;
  color: #000000;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #e0e0e0;
  }

  &:active {
    background-color: #d5d5d5;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
`;

export default props => {
  const navigate = useNavigate()
  const [isOpened, setIsOpened] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [activeTab, setActiveTab] = useState('find');
  const [chatRequests, setChatRequests] = useState([]);

  const user = useSelector((state) => state.user.user);
  console.log('user의 uid : ', user.uid);

  useEffect(() => {
    /* Find Partners */
    const fetchProfiles = async () => {
      try {
        const userList = await GetPartnerList();
        setProfiles(userList);

      } catch (error) {
        console.log('유저 리스트 불러오기 실패 : ', error);
      }
    };

    /* Chat Request Partners */
    const fetchRequestProfiles = async () => {
      try {
        const requestUserList = await GetRequestPartnerList(user.uid);
        setChatRequests(requestUserList);

      } catch (error) {
        console.log('요청 유저 리스트 불러오기 실패 : ', error);
      }
    };

    fetchProfiles();
    fetchRequestProfiles();

  }, [user.uid]);

  /* Chat Request Partners */
  // useEffect(() => {
  //   const socket = new WebSocket('ws://localhost:8080');

  //   socket.onopen = () => {
  //     console.log('WebSocket 연결 성공');
  //     socket.send(JSON.stringify({ type: 'init', userId: user.uid }));
  //   };

  //   socket.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     if (data.type === 'newChatRequest' && data.receiverId === user.uid) {
  //       setChatRequests(prevRequest => [...prevRequest, data]);
  //     }
  //   };

  //   socket.onclose = () => {
  //     console.log('WebSocket 연결 종료');
  //   };

  //   return () => {
  //     socket.close();
  //   };
  // }, [user.uid]);

  const handleOpenRequestModal = (profile) => {
    setIsOpened(true);
    setSelectedProfile(profile);
  };

  const handleOpenResponseModal = (request) => {
    setIsOpened(true);
    setSelectedChatRoom(request);
  };

  const handleCloseModal = () => {
    setIsOpened(false);
    setSelectedProfile(null);
  };

  const onClickRequestModalButton = async (userId) => {

    const chat_room = {
      accessStatus: 1,
      partnerId: userId
    };

    try {
      const chatRoomId = await CreateChat(chat_room);
      console.log('채팅방 생성 후 이동~');
      navigate(`/live-chat/${chatRoomId}`); // 채팅 요청시 생성된 채팅방으로 이동

    } catch (error) {
      console.log('채팅방 생성 실패', error);
    }
  }

  const onClickResponseModalButton = async (chatRoomtId) => {
    try {
      console.log('채팅방 입장~');
      navigate(`/live-chat/${chatRoomtId}`);

      await UpdateChatRoomStatus(chatRoomtId);
      console.log('join Status update 필요');

    } catch (error) {
      console.log('채팅방 입장 실패', error);
    }
  }

  return (
    <CenteredMainLayout>
      <PartnersTab>
        <PartnersBtn onClick={() => setActiveTab('find')}>Find Partners</PartnersBtn><br />
        <PartnersBtn onClick={() => setActiveTab('requests')}>Chat Request Partners</PartnersBtn>
      </PartnersTab>
      <Container>
        {selectedProfile && !selectedChatRoom && (
          <Modal
            isOpened={isOpened}
            onClickCloseBtn={() => handleCloseModal()}
            bttnTxt="대화 요청"
            selectedProfile={selectedProfile}
            onClickButton={() => onClickRequestModalButton(selectedProfile.userId)}
          // userId={user.uid}
          // chatUserId={selectedProfile.id}
          />
        )}
        {activeTab === 'find' &&
          profiles?.map((profile, index) => {
            // const {
            //   name: userName,
            //   // image: src,
            //   // language: tags,
            //   selfIntroduction: description,
            // } = profile
            const { userCode, userName, selfIntroduction } = profile;

            return (
              <StyledProfileItem
                key={index}
                title={userName}
                // src={src}
                // tags={tags}
                content={selfIntroduction}
                userCode={userCode}

                onClick={() => handleOpenRequestModal(profile)} />
            )
          })
        }
        {selectedChatRoom && (
          <Modal
            isOpened={isOpened}
            onClickCloseBtn={() => handleCloseModal()}
            bttnTxt="채팅방 입장"
            selectedProfile={selectedChatRoom}
            onClickButton={() => onClickResponseModalButton(selectedChatRoom.chatRoomId)}
          />
        )}
        {activeTab === 'requests' &&
          chatRequests?.map((request, index) => {
            const { userCode, userName, description } = request;

            return (
              <StyledProfileItem
                key={index}
                title={userName}
                content={description}
                userCode={userCode}
                onClick={() => handleOpenResponseModal(request)}
              />
            )
          })
        }
      </Container>
    </CenteredMainLayout>
  )
}