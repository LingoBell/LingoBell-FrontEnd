import React, { useState } from 'react'
import styled from 'styled-components'
import CenteredMainLayout from '../templates/CenteredMainLayout'
import ProfileItem from '../molecules/ProfileItem'
import Modal from '../molecules/Modal'
import { useNavigate } from 'react-router-dom'
import { PROFILE_DATA } from '../../../consts/sampleData'
const profiles = PROFILE_DATA

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

  const handleOpenModal = (profile) => {
    setIsOpened(true);
    setSelectedProfile(profile);
  };

  const handleCloseModal = () => {
    setIsOpened(false);
    setSelectedProfile(null);
  };

  const onClickModalButton = (id) => {
    console.log(id)
    navigate(`/live-chat/${id}`)
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
            onClickButton={() => onClickModalButton(selectedProfile.id)}
          />
        )}
        {
          profiles.map((profile, index) => {
            const {
              name: title,
              image: src,
              language: tags,
              selfIntroduction: content
            } = profile
            return (
              <StyledProfileItem
                key={index}
                title={title}
                src={src}
                tags={tags}
                content={content}
                
                onClick={() => handleOpenModal(profile)} />
            )
          })
        }
      </Container>
    </CenteredMainLayout>
  )
}