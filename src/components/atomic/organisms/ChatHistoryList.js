import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { PROFILE_DATA } from '../../../consts/sampleData'
import ProfileItem from '../molecules/ProfileItem'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getMyProfile, GetUserProfile } from '../../../apis/UserAPI'
const ProfileWrap = styled.aside`
  /* max-height: 100%; */
  /* max-height: 100px; */
  width: 100%;
  @media screen and (min-width: 1024px) {
    width: 25%;
    max-width: 300px;
    border-right: 1px solid rgba(0,0,0,0.1);
  }
  /* overflow: auto; */
`

const StyledProfileItem = styled(ProfileItem)`
  padding-top: 16px;
  padding-bottom: 16px;
  padding-right: 24px;
  padding-left: 24px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  ${props => props.$isSelected && `
    background-color: #d5d5d5;
  `}
`
const MyProfileItem = styled(StyledProfileItem)`
  background-color: rgba(0,0,0,0.05);
`
export default props => {
  const {
    chatHistoryList
  } = props

  const[myProfile, setMyProfile] = useState({});

  const user = useSelector((state)=>state.user.user);

  useEffect(()=>{

    const fetchProfiles = async() => {
      try{
        const profile = await getMyProfile()
        setMyProfile(profile)
      } catch(error) {
        console.log('내 프로필 불러오기 실패:', error)
      }
    }

    fetchProfiles();
  },[user.uid])

  const navigate = useNavigate()
  

  const onClickProfileItem = (id) => {
    navigate('/chat-history/'+id)
  }

  const { gender,
          nation,
          age,
          userName,
          userId,

  } = myProfile;
  console.log('myProfile',myProfile)
  return (
    <ProfileWrap className={props.className}>
        <MyProfileItem //마이프로필
        isSmall='small'
        className = 'small'
        key={userId}
        gender={gender}
        nation={nation}
        age={age}
        userName={userName}
        />
        {/* 채팅히스토리데이터 */}
        {
          chatHistoryList.map((profile, index) => {

            return (
              <StyledProfileItem
                size='small'
                {...profile}
                key={index}
                onClick={() => onClickProfileItem(profile.chatRoomId)}
              />

            )
          })
        }
      </ProfileWrap>
  )
}