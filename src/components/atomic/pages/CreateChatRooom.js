import React from 'react'
import styled from 'styled-components'
import FormItem from '../molecules/FormItem'
import ButtonCheckBox from '../atoms/ButtonCheckBox'
import { Title, Paragraph } from '../atoms/Typograpy'
import Input from '../atoms/Input'



const Container = styled.div`
  background-color : white;


`
const PageTitle = styled.div`

`
const DetailBox = styled.div`

`
const Wrap = styled.div`

`

/**
 * FormItem 컴포넌트를 만들고 
 * 그 안에 컴포넌트를 넘겨서 만듭니다(children)
 * 반복해서 사용해서만 만듭니다.
 * data를 map을 통해서 만듭니다.
 * 
 * 
 */
const data = {
  title: 'Create public',
  parag: 'aaaaa',
  inputs: [
  {
    title: 'Chat Room Title'
  },
  {
    title: 'Native Languages',
    checkboxes: [
      'English', 'Spanish', 'French'
    ]
  },
  {
    title: 'Target Languages',
    checkboxes: [
      'English', 'Spanish', 'French',
      'German',
      'Korean',
      'Chinese',
      'Japanese',
    ]
  }
]
}
export default props => {
  return (
    <Container>
      <Wrap>
      <PageTitle>{data['title']}</PageTitle>
      <DetailBox>
        <p>{data['parag']}</p>
      </DetailBox>
      {data.inputs.map((item,index) => {
        if(item.checkboxes){
          return(
          <>
            <FormItem title={item.title}>
              <div style={{display : 'flex'}}>
             {
                item.checkboxes.map(check => {
                  return(
                    <ButtonCheckBox>{check}</ButtonCheckBox>
                  )
                })
             }
             </div>
            </FormItem>
            </>
          )
          
        }else{
          return(
            <FormItem title={item.title}>
              <Input placeholder='Enter a title'></Input>
            </FormItem>
          )
        }
    
      })}
    
      </Wrap>
    </Container>
    
  )
}