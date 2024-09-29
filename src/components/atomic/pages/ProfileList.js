import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import CenteredMainLayout from '../templates/CenteredMainLayout'
import ProfileItem from '../molecules/ProfileItem'
import Modal from '../molecules/Modal'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CreateChat, getChatRooms, UpdateChatRoomStatus } from '../../../apis/ChatAPI'
import { GetPartnerList, GetRequestPartnerList } from '../../../apis/PartnerAPI'
import { user_online_status } from '../../../firebase/firebase'


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

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const FilterGroup = styled.div`
  flex: 1;
  margin: 0 10px;
`;

const FilterTitle = styled.h3`
  margin-bottom: 10px;
  font-size: 20px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background-color: ${props => props.checked ? '#7086F3' : '#f0f2f5'};
  border: 2px solid ${props => props.checked ? '#7086F3' : 'transparent'};
  color: ${props =>  props.checked ? 'white' : 'black'};
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.checked ? '#7086F3' : '#e4e6eb'};
    color: ${props =>  props.checked ? 'white' : 'black'};
  }
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  display: none;
`;

export default props => {
  const navigate = useNavigate()
  const [isOpened, setIsOpened] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [activeTab, setActiveTab] = useState('find');
  const [chatRequests, setChatRequests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const user = useSelector((state) => state.user.user);

  const fetchProfiles = async () => {
    try {
      const userState = await user_online_status();
      const userList = await GetPartnerList();
      const newUserList = userList.map(profile => {

        const userStatus = userState[profile.userCode]?.status?.state;

        return {
          ...profile, userStatus: userStatus
        }
      })
      setProfiles(newUserList);
      console.log('profile-info', newUserList)

    } catch (error) {
      console.log('유저 리스트 불러오기 실패 : ', error);
    }
  };

  const filterProfiles = (profiles) => {
    return profiles.filter(profile => {
      const interestMatch = selectedInterests.length === 0 ||
        profile.interests.some(interest => selectedInterests.includes(interest));
        const languageMatch = selectedLanguages.length === 0 ||
        selectedLanguages.includes(profile.nativeLanguage);
      return interestMatch && languageMatch;
    });
  };

  const getUniqueValues = (profiles, key) => {
    const allValues = profiles.flatMap(profile => {
      if (key === 'interests') {
        return profile[key];
      } else if (key === 'nativeLanguage') {
        return [...new Set(profiles.map(profile => profile[key]))];
      }
      return [];
    });
    return [...new Set(allValues)];
  };

  const handleInterestChange = (interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguages(prev =>
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  const filteredProfiles = filterProfiles(profiles);
  const allInterests = getUniqueValues(profiles, 'interests');
  const allLanguages = getUniqueValues(profiles, 'nativeLanguage');

  /* Chat Request Partners */
  const fetchRequestProfiles = async () => {
    try {
      const userState = await user_online_status();
      const requestUserList = await GetRequestPartnerList();
      const newRequestUserList = requestUserList.map(request => {
        const userStatus = userState[request.userCode]?.status?.state;

        return {
          ...request, userStatus: userStatus
        }
      })
      setChatRequests(newRequestUserList);

    } catch (error) {
      console.log('요청 유저 리스트 불러오기 실패 : ', error);
    }
  };

  useEffect(() => {
    /* Find Partners */


    fetchProfiles();
    fetchRequestProfiles();

  }, [user.uid]);

  useEffect(() => {
    fetchProfiles();
  }, [activeTab])

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

  const handleCloseResponseModal = () => {
    setIsOpened(false)
    setSelectedChatRoom(null)
  }

  const onClickRequestModalButton = async (userId) => {

    const chat_room = {
      accessStatus: 1,
      partnerId: userId,
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

      {activeTab === 'find' && (
        <FilterContainer>
          <FilterGroup>
            <FilterTitle>Interests</FilterTitle>
            <CheckboxContainer>
              {allInterests.map((interest, index) => (
                <CheckboxLabel key={index} checked={selectedInterests.includes(interest)}>
                  <HiddenCheckbox
                    checked={selectedInterests.includes(interest)}
                    onChange={() => handleInterestChange(interest)}
                  />
                  {interest}
                </CheckboxLabel>
              ))}
            </CheckboxContainer>
          </FilterGroup>
          <FilterGroup>
            <FilterTitle>Native Languages</FilterTitle>
            <CheckboxContainer>
              {allLanguages.map((language, index) => (
                <CheckboxLabel key={index} checked={selectedLanguages.includes(language)}>
                  <HiddenCheckbox
                    checked={selectedLanguages.includes(language)}
                    onChange={() => handleLanguageChange(language)}
                  />
                  {language}
                </CheckboxLabel>
              ))}
            </CheckboxContainer>
          </FilterGroup>
        </FilterContainer>
      )}

      <Container>
        {selectedProfile && !selectedChatRoom && (
          <Modal
            isOpened={isOpened}
            onClickCloseBtn={() => handleCloseModal()}
            bttnTxt="Request Language Exchange"
            selectedProfile={selectedProfile}
            onClickButton={() => onClickRequestModalButton(selectedProfile.userId)}
          // userId={user.uid}
          // chatUserId={selectedProfile.id}
          />
        )}
        {activeTab === 'find' &&
          filteredProfiles?.sort((a, b) => {
            if (a.userStatus === 'online' && b.userStatus !== 'online') return -1;
            if (a.userStatus !== 'online' && b.userStatus === 'online') return 1;
            return 0
          })
            .map((profile, index) => {

              const { description,
                gender,
                interests,
                learningLanguages,
                nation,
                nativeLanguage,
                userName,
                profileImages,
                birthday,
                userStatus,
              } = profile;

              return (
                <StyledProfileItem
                  key={index}
                  userName={userName}
                  nativeLanguage={nativeLanguage}
                  content={description}
                  gender={gender}
                  interests={interests}
                  learningLanguages={learningLanguages}
                  nation={nation}
                  profileImages={profileImages}
                  hideContent={false}
                  birthday={birthday}
                  userStatus={userStatus}
                  onClick={() => handleOpenRequestModal(profile)} />
              )
            })
        }
        {selectedChatRoom && (
          <Modal
            isOpened={isOpened}
            onClickCloseBtn={() => handleCloseResponseModal()}
            bttnTxt="Enter Chat Room"
            selectedProfile={selectedChatRoom}
            onClickButton={() => onClickResponseModalButton(selectedChatRoom.chatRoomId)}
          />
        )}
        {activeTab === 'requests' &&
          chatRequests?.sort((a, b) => {
            if (a.userStatus === 'online' && b.userStatus !== 'online') return -1;
            if (a.userStatus !== 'online' && b.userStatus === 'online') return 1;
            return 0
          })
            .map((request, index) => {
              const { description,
                gender,
                interests,
                learningLanguages,
                nation,
                nativeLanguage,
                userName,
                profileImages,
                birthday,
                userStatus,
              } = request

              return (
                <StyledProfileItem
                  key={index}
                  userName={userName}
                  nativeLanguage={nativeLanguage}
                  content={description}
                  gender={gender}
                  interests={interests}
                  learningLanguages={learningLanguages}
                  nation={nation}
                  profileImages={profileImages}
                  hideContent={false}
                  birthday={birthday}
                  userStatus={userStatus}
                  onClick={() => handleOpenResponseModal(request)}
                />
              )
            })
        }
      </Container>
    </CenteredMainLayout>
  )
}