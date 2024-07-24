import React, { useState } from 'react'
import styled from 'styled-components'
import CenteredMainLayout from '../templates/CenteredMainLayout'
import ProfileItem from '../molecules/ProfileItem'
import Modal from '../molecules/Modal'
const profiles = [
  {
    'image': 'https://image.genie.co.kr/Y/IMAGE/IMG_ARTIST/080/507/961/80507961_1652683146939_14_200x200.JPG/dims/resize/Q_80,0',
    'name': 'Sungwoo Cho',
    'language': ['Language Learner', 'Korean', 'English'],
    'selfIntroduction': 'Update your profile information'
  },
  {
    'image': 'https://image.genie.co.kr/Y/IMAGE/IMG_ARTIST/080/507/961/80507961_1652683146939_14_200x200.JPG/dims/resize/Q_80,0',
    'name': 'Tom',
    'language': ['Language Learner', 'Korean', 'English'],
    'selfIntroduction': 'Update your profile information'
  },
  {
    'image': 'https://image.genie.co.kr/Y/IMAGE/IMG_ARTIST/080/507/961/80507961_1652683146939_14_200x200.JPG/dims/resize/Q_80,0',
    'name': 'Scarlett',
    'language': ['Language Learner', 'Korean', 'English'],
    'selfIntroduction': 'Update your profile information'
  },
  {
    'image': 'https://image.genie.co.kr/Y/IMAGE/IMG_ARTIST/080/507/961/80507961_1652683146939_14_200x200.JPG/dims/resize/Q_80,0',
    'name': 'Jinwoo',
    'language': ['Language Learner', 'Korean', 'English'],
    'selfIntroduction': 'Update your profile information'
  },
  {
    'image': 'https://image.genie.co.kr/Y/IMAGE/IMG_ARTIST/080/507/961/80507961_1652683146939_14_200x200.JPG/dims/resize/Q_80,0',
    'name': 'Max',
    'language': ['Language Learner', 'Korean', 'English'],
    'selfIntroduction': 'Update your profile information'
  },
  {
    'image': 'https://image.genie.co.kr/Y/IMAGE/IMG_ARTIST/080/507/961/80507961_1652683146939_14_200x200.JPG/dims/resize/Q_80,0',
    'name': 'Jay',
    'language': ['Language Learner', 'Korean', 'English'],
    'selfIntroduction': 'dasljnawaeflaelfnalfnlaksfalskfsldkflaksdefnlkaesfnlkaesfnlseflnkaeskfnlajwdnlawddUpdatedasljnawlajwdnlawddUpdate your profile information'
  }
]

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color : red;
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
  margin : 12px 12px;
  @media screen and (min-width : 800px){
    // margin : 
    width : calc(50% - 24px)
  }
`

export default props => {
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

  return (
    <CenteredMainLayout>
      <Container>
        {selectedProfile && (
          <Modal
            isOpened={isOpened}
            onClickCloseBtn={() => handleCloseModal()}
            bttnTxt="대화 요청"
            selectedProfile={selectedProfile}
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