import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import CenteredMainLayout from '../templates/CenteredMainLayout'
import ProfileItem from '../molecules/ProfileItem'
import Modal from '../molecules/Modal'
import { useNavigate } from 'react-router-dom'
import { PROFILE_DATA } from '../../../consts/sampleData'
import { useSelector } from 'react-redux'
import { CreateChat } from '../../../apis/ChatAPI'
import { GetUserList } from '../../../apis/UserAPI'

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

export default props => {
  const navigate = useNavigate()
  const [isOpened, setIsOpened] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const user = useSelector((state) => state.user.user);
  console.log('user의 uid : ', user.uid);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const userList = await GetUserList();
        setProfiles(userList);

      } catch (error) {
        console.log('유저 리스트 불러오기 실패 : ', error);
      }
    };
    fetchProfiles();
  }, [])

  const handleOpenModal = (profile) => {
    setIsOpened(true);
    setSelectedProfile(profile);
  };

  const handleCloseModal = () => {
    setIsOpened(false);
    setSelectedProfile(null);
  };

  const onClickModalButton = async (userId) => {
    console.log(userId)

    const chat_room = {
      accessStatus: 1,
      chatName: 'Chat with ' + userId,
      chatRoomDescript: null,
      chatContents: null,
      partnerId: userId,
    };

    try {
      const chatRoomId = await CreateChat(chat_room);
      navigate(`/live-chat/${chatRoomId}`); // 채팅 요청시 생성된 채팅방으로 이동

    } catch (error) {
      console.log('채팅방 생성 실패', error);
    }
  }

  return (
    <CenteredMainLayout>
      <Container>
        {selectedProfile && (
          <Modal
            isOpened={isOpened}
            onClickCloseBtn={() => handleCloseModal()}
            bttnTxt="대화 요청"
            selectedProfile={selectedProfile}
            onClickButton={() => onClickModalButton(selectedProfile.userId)}
          // userId={user.uid}
          // chatUserId={selectedProfile.id}
          />
        )}
        {
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

                onClick={() => handleOpenModal(profile)} />
            )
          })
        }
      </Container>
    </CenteredMainLayout>
  )
}