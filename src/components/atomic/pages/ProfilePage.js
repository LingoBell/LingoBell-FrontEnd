

import React, { useState } from 'react'
import styled from 'styled-components'

const languages = ['English', 'Spanish', 'French', 'German', 'Korean', 'Japanese', 'Chinese']
const interests = ['Traveling', 'Reading', 'Cooking', 'Hiking', 'Photography', 'Music', 'Movies', 'Fitness', 'Technology',
    'Gaming', 'Art', 'Dancing', 'Writing', 'Learning Languages', 'Cycling', 'Yoga', 'Meditation', 'Gardening', 'Fishing', 'Crafting', 'Volunteering', 'Sports',
    'Fashion', 'Food Tasting', 'History', 'Astronomy', 'Blogging', 'Podcasts', 'Theater',
    'DIY Projects']
const gender = ['Male', 'Female']


const Wrap = styled.div`

`

const FormItemWrap = styled.div`
    display: flex;
    flex-direction: column;
`

const LabelText = styled.label`
    /* display: block; */
    font-weight: bold;
`

const Input = styled.input`
    /* display: block; */
`

const Select = styled.select`

`

const Radio = styled.input`

`

const CheckboxButton = styled.div`
    background-color: blue;
    padding: 8px 16px;
    color: white;
    margin-right: 4px;
    ${props =>props.swcho && `
        background-color: red;
    `}
`

const RadioButton = styled.div`
    background-color: gold;
    padding: 8px 16px;
    color: white;
    margin-right: 4px;
    ${props =>props.swcho && `
        background-color: grey;
    `}
`
export default props => {
    const [selectedInterests, setSelectedInterests] = useState([])
    const [gender, setGender] = useState(null)
    const [name, setName] = useState('')
    const [mainLanguage, setMainLanguage] = useState('')
    const [learningLanguages, setLearningLanguages] = useState([])

    // const [languageWithLevel , setLanguageWithLevel] = useState({})    
    const [languageWithLevel, setLanguageWithLevel] = useState()
    // 
    const changeSwCho = () => {

    }
    return (
        <Wrap>
            <FormItemWrap>
                <LabelText>Name</LabelText>
                <Input/>
            </FormItemWrap>
            <FormItemWrap>
                <LabelText>Main Language</LabelText>
                <Select>
                    <option disabled value=''>Choose Your Main Language</option> 
                    {/* value = '' 는 기본값을 맞추기 위해서, disabled된 경우 첫번째 option 이 선택되어있지 않게 됨 */}
                    
                </Select>
            </FormItemWrap>
            <FormItemWrap style={{flexDirection: 'row'}}>
                <LabelText>성별</LabelText>
                <div style={{flex: 1}} />
                {/* 여자는 1 남자는 2 */}
                
            </FormItemWrap>

            
            <FormItemWrap>
                <LabelText>Learning Language</LabelText>
                <div style={{display: 'flex', }}>
                    
                </div>
            </FormItemWrap>
                <FormItemWrap>
                    <LabelText>Choose Your Interests</LabelText>
                    <div style={{display : 'flex', flexWrap : 'wrap'}}>
                    </div>
                </FormItemWrap>
            

        </Wrap>
    )
}