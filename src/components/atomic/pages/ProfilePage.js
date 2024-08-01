import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '../atoms/Button'
import { languages, interests, nations } from '../../../consts/profileDataKeyList'
import Select from 'react-select'
import axios from 'axios'

const options = nations.map(nation => ({
    label: nation.name,
    value: nation.code,
}))

const Wrap = styled.div`
    max-width : 600px;
    margin-left : auto;
    margin-right : auto;
    padding : 32px 24px 32px 24px;
    overflow-y : auto;
`

const FormItemWrap = styled.div`
    padding-bottom : 12px;
    display: flex;
    flex-direction: column;
`

const LabelText = styled.label`
    font-weight: bold;
    padding : 8px 0px 8px 0px;
    span {
        font-weight : lighter;
        color : rgba(0,0,0,0.7);
    }
`

const Input = styled.input`
    padding : 8px;
    border : 1px solid #eee;
    border-radius : 6px;
`

const StyledSelect = styled.select`
    margin-bottom : 6px;
    width : 100%;
    padding : 8px;
    border-color : rgb(204,204,204);
    border-radius : 6px;
    color : rgba(0,0,0,0.5);
`

const CheckboxButton = styled.div`
    background-color: #eee;
    padding: 8px 16px;
    color: black;
    margin-top: 4px;
    margin-left : 4px;
    border : 1.5px solid #eee;
    border-radius : 6px;
    cursor : pointer;
    ${props => props.$cliked && `
        background-color: #49454F;
        color : white;
    `}
`

const RadioButton = styled.div`
    background-color: #eee;
    padding: 8px 16px;
    color: black;
    margin: 4px 4px;
    border : 1.5px solid #eee;
    border-radius : 6px;
    cursor : pointer;
    ${props => props.$cliked && `
        background-color: #49454F;
        color : white;
    `}
`
const Title = styled.div`
    font-weight : bold;
    font-size : 32px;
    padding-bottom : 12px;
`
const StyledTextArea = styled.textarea`
    resize : none;
    padding-top : 12px;
    padding-left : 8px;
    border : 1.5px solid #eee;
    border-radius : 6px;
`
const HintButton = styled.div`
    background-color : #eee;
    width : 24px;
    height : 24px;
    cursor : pointer;
    display : flex;
    justify-content : center;
    align-items : center;
    font-size : 16px;
    border-radius : 50%;
    margin-top : 4px;
    margin-left : 10px;
`
const HintBox = styled.div`
    border : 1px solid #eee;
    border-radius : 6px;
    padding-top : 12px;
    padding-left : 12px;
    padding-bottom : 12px;
    margin-bottom : 12px;
    margin-top : 12px;
    color : rgba(0,0,0,0.7);

    p {
        margin-left : 12px;
    }
    
    
`
export default props => {
    const [selectedInterests, setSelectedInterests] = useState([])
    const [nation, setNation] = useState('')
    const [gender, setGender] = useState(null)
    const [name, setName] = useState('')
    const [mainLanguage, setMainLanguage] = useState('')
    const [learningLanguages, setLearningLanguages] = useState([])
    const [languageWithLevel, setLanguageWithLevel] = useState({})
    const [userIntroduce, setUserIntroduce] = useState('')
    const [hintModal, setHintModal] = useState(false)

    const handleChange = (nation) => {
        setNation(nation)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            selectedInterests,
            gender,
            name,
            mainLanguage,
            learningLanguages,
            languageWithLevel,
            userIntroduce,
            nation,
        }

        if (selectedInterests.length === 0 ||
            !gender || name === '' || mainLanguage === '' ||
            learningLanguages.length === 0 || Object.keys(languageWithLevel).length === 0
            || nation === ''
        ) {
            alert("All fields required")
            return false
        } else {
            try{
                const response = await axios.post('http://127.0.0.1:8000/users/setUserProfile',
                    formData, {
                        headers: {
                            'Content-Type' : 'application/json',
                        }
                    }
                );
                console.log('Success:', response.data)
            }catch(error){
                console.log('Error:', error)
            }
        }
    }
    return (
        <Wrap>
            <Title>Create User Profile</Title>
            <FormItemWrap>
                <LabelText>Name</LabelText>
                <Input placeholder='Enter Your Name' value={name} onChange={(e) => {
                    setName(e.target.value)
                }} />
            </FormItemWrap>

            <div style={{ display: 'flex' }}>
                <FormItemWrap style={{ width: '49%' }}>
                    <LabelText>Native Language</LabelText>
                    <StyledSelect value={mainLanguage}
                        style={{ paddingBottom: '11px' }}
                        onChange={(e) => {
                            setMainLanguage(e.target.value)
                        }}>
                        <option disabled value=''>Select Your Main Language</option>
                        {languages.map(lang => {
                            return (
                                <option>{lang}</option>
                            )
                        })}
                        {/* value = '' 는 기본값을 맞추기 위해서, disabled된 경우 첫번째 option 이 선택되어있지 않게 됨 */}

                    </StyledSelect>
                </FormItemWrap>
                <div style={{ flex: 1 }} />
                <FormItemWrap style={{ width: '49%' }}>
                    <LabelText>Nation</LabelText>
                    <Select         //react-select
                        value={nation}
                        onChange={handleChange}
                        options={options}
                        placeholder="Select Your Country"
                        isClearable />
                </FormItemWrap>
            </div>


            <FormItemWrap style={{ flexDirection: 'row' }}>
                <LabelText>Gender</LabelText>
                <div style={{ flex: 1 }} />
                <CheckboxButton $cliked={gender == 1} onClick={() => {
                    setGender(1)
                }}>Female</CheckboxButton>
                <CheckboxButton $cliked={gender == 2} onClick={() => {
                    setGender(2)
                }}>Male</CheckboxButton>
                {/* 여자는 1 남자는 2 */}

            </FormItemWrap>


            <FormItemWrap>
                <div style={{ display: 'flex' }}>
                    <LabelText>Learning Language</LabelText>
                    <HintButton onClick={() => {
                        setHintModal(!hintModal)
                    }}>?</HintButton>
                </div>
                {
                    hintModal && (
                        <HintBox>
                            <p>The numbers represent the user's language proficiency level.</p>
                            <p>1 - Beginner</p>
                            <p>2 - Elementary</p>
                            <p>3 - Intermediate</p>
                            <p>4 - Upper-Intermediate</p>
                            <p>5 - Advanced</p>
                            <p>6 - Proficient</p>

                        </HintBox>
                    )
                }
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {languages.map(lang => {
                        if (!mainLanguage.includes(lang)) {
                            return (
                                <RadioButton $cliked={learningLanguages.includes(lang)}
                                    onClick={() => {
                                        if (!learningLanguages.includes(lang)) {
                                            setLearningLanguages([...learningLanguages, lang])
                                        } else {
                                            const newLearningLanguages = learningLanguages.filter(item => item !== lang)
                                            setLearningLanguages(newLearningLanguages)
                                            const newLangaugeWithLevel = {
                                                ...languageWithLevel
                                            }
                                            delete newLangaugeWithLevel[lang]
                                            setLanguageWithLevel(
                                                newLangaugeWithLevel
                                            )
                                        }
                                    }}
                                >{lang}</RadioButton>
                            )
                        }
                    })}
                </div>
            </FormItemWrap>

            <FormItemWrap>
                {learningLanguages.map(lang => {
                    const thisLanguageLevel = languageWithLevel[lang]
                    if (learningLanguages.includes(lang)) {
                        return (
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <LabelText>{lang}</LabelText>
                                <div style={{ flex: 1 }} />
                                <StyledSelect style={{ width: 'calc(80% - 12px)' }}
                                    value={thisLanguageLevel} onChange={(e) => {
                                        const newLangaugeWithLevel = {
                                            ...languageWithLevel, [lang]: e.target.value
                                        }
                                        setLanguageWithLevel(newLangaugeWithLevel)
                                    }}>
                                    <option disabled selected>Proficiency Level</option>
                                    {[1, 2, 3, 4, 5, 6].map(level => {
                                        return (
                                            <option>{level}</option>
                                        )
                                    })}
                                </StyledSelect>
                            </div>
                        )
                    }
                })}
            </FormItemWrap>

            <FormItemWrap>
                <LabelText>Choose Your Interests <span>(up to 5 interests)</span></LabelText>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {interests.map(item => {
                        return (
                            <RadioButton $cliked={selectedInterests.includes(item)}
                                onClick={() => {
                                    if (!selectedInterests.includes(item) && selectedInterests.length < 5) {
                                        setSelectedInterests([...selectedInterests, item])
                                    } else {
                                        const newSelectedInterests = selectedInterests.filter(interest => interest !== item)
                                        setSelectedInterests(newSelectedInterests)
                                    }
                                }}
                            >{item}</RadioButton>
                        )
                    })}
                </div>
            </FormItemWrap>

            <FormItemWrap>
                <LabelText>Tell me about your-self!</LabelText>
                <StyledTextArea placeholder='Introduce your self'
                    value={userIntroduce} onChange={(event) => {
                        setUserIntroduce(event.target.value)
                    }} />
            </FormItemWrap>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleSubmit}>submit</Button>
            </div>

        </Wrap>
    )
}