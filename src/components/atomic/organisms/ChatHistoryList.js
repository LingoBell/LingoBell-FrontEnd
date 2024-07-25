import React from 'react'
import styled from 'styled-components'
import { PROFILE_DATA } from '../../../consts/sampleData'
import ProfileItem from '../molecules/ProfileItem'
import { useNavigate } from 'react-router-dom'
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
  const firstProfile = PROFILE_DATA[0]
  const {
    name: ftitle,
    image: fsrc,
    language: ftags,
    selfIntroduction: fcontent
  } = firstProfile
  const navigate = useNavigate()
  

  const onClickProfileItem = (id) => {
    navigate('/chat-history/'+id)
  }
  return (
    <ProfileWrap className={props.className}>
        <MyProfileItem 
          size='small'
          title={ftitle}
          src={fsrc}
          tags={ftags}
          content={fcontent}
          hideContent
        
        />
        {
          PROFILE_DATA.map((profile, index) => {
            const {
              name: title,
              image: src,
              language: tags,
              selfIntroduction: content
            } = profile
            return (
              <StyledProfileItem
                size='small'
                key={index}
                title={title}
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