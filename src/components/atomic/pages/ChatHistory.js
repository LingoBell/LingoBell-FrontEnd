import React from 'react'
import styled from 'styled-components'
import CenteredMainLayout from '../templates/CenteredMainLayout' 
import ProfileItem from '../molecules/ProfileItem'
const profiles = [
  {
      'image': 'https://source.unsplash.com/random/200x200?person1',
      'name': 'Sungwoo Cho',
      'language': ['Language Learner', 'Korean', 'English'],
      'selfIntroduction': 'Update your profile information'
  },
  {
      'image': 'https://source.unsplash.com/random/200x200?person2',
      'name': 'Tom',
      'language': ['Language Learner', 'Korean', 'English'],
      'selfIntroduction': 'Update your profile information'
  },
  {
      'image': 'https://source.unsplash.com/random/200x200?person3',
      'name': 'Scarlett',
      'language': ['Language Learner', 'Korean', 'English'],
      'selfIntroduction': 'Update your profile information'
  },
  {
      'image': 'https://source.unsplash.com/random/200x200?person4',
      'name': 'Jinwoo',
      'language': ['Language Learner', 'Korean', 'English'],
      'selfIntroduction': 'Update your profile information'
  },
  {
      'image': 'https://source.unsplash.com/random/200x200?person5',
      'name': 'Max',
      'language': ['Language Learner', 'Korean', 'English'],
      'selfIntroduction': 'Update your profile information'
  },
  {
      'image': 'https://source.unsplash.com/random/200x200?person6',
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
  return (
    <CenteredMainLayout>
      <Container>
        {
          profiles.map(profile => {
            return (
              <ProfileItem {...profile} />
            )
          })
        }
      </Container>
    </CenteredMainLayout>
  )
}