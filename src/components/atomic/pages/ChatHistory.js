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
    'selfIntroduction': 'Update your profile information'
  }
]

const Container = styled.div`
  display: flex;
  flex-direction: column;

  @media screen and (min-width: 1024px) {
    flex-direction: row;
    flex-wrap: wrap;
    padding-left: 12px;
    padding-right: 12px;
    > div {
      min-width: calc(50% - 24px);
      margin-left: 12px;
      margin-right: 12px;
    }
  }
`

export default props => {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenModal = () => {
    setIsOpened(true);
  };

  const handleCloseModal = () => {
    setIsOpened(false);
  };

  const showProfileItem = () => {
    profiles.map((profile, index) => {
      const {
        name: title,
        image: src,
        language: tags,
        selfIntroduction: content
      } = profile
      return (
        <ProfileItem
          key={index}
          title={title}
          src={src}
          tags={tags}
          content={content}
          onClick={() => handleOpenModal()} />
      )
    })
  };

  return (
    <CenteredMainLayout>
      <Container>
        <Modal
          isOpened={isOpened}
          onClickCloseBtn={() => handleCloseModal()}
          bttnTxt="대화 요청"
          profile={profile}
        />

        {
          profiles.map((profile, index) => {
            const {
              name: title,
              image: src,
              language: tags,
              selfIntroduction: content
            } = profile
            return (
              <ProfileItem
                key={index}
                title={title}
                src={src}
                tags={tags}
                content={content}
                onClick={() => handleOpenModal()} />
            )
          })
        }
      </Container>
    </CenteredMainLayout>
  )
}