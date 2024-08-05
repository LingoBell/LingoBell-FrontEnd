import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { PROFILE_DATA } from '../../../consts/sampleData'
import ProfileItem from '../molecules/ProfileItem'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { GetUserProfile } from '../../../apis/UserAPI'
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
  const[myProfile, setMyProfile] = useState([]);

  const user = useSelector((state)=>state.user.user);

  const calculateAge = (birthday) => {
    if (!birthday) {
      return 20;
    }

    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(()=>{

    const fetchProfiles = async() => {
      try{
        const profile = await GetUserProfile(user.uid)
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
  console.log(myProfile)
  return (
    <ProfileWrap className={props.className}>
        <MyProfileItem //마이프로필
        key={userId}
        gender={gender}
        nation={nation}
        age={age}
        userName={userName}
        />
        {
          PROFILE_DATA.map((profile, index) => {
            const {
              image: src,
              language: tags,
              selfIntroduction: content
            } = profile
            return (
              <StyledProfileItem
                size='small'
                key={index}
                src={src}
                tags={tags}
                content={content}
                textEllipsis
                onClick={() => onClickProfileItem('id-' + (index + 1))}
              />

            )
          })
        }
      </ProfileWrap>
  )
}