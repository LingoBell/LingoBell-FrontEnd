import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '../atoms/Button'
import { languages, interests, nations } from '../../../consts/profileDataKeyList'
import Select from 'react-select'
import { AddUserProfile } from '../../../apis/UserAPI'
import { useNavigate } from 'react-router-dom'

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
    const [selectedInterests, setSelectedInterests] = useState({})
    const [nation, setNation] = useState('')
    const [gender, setGender] = useState(null)
    const [name, setName] = useState('')
    const [mainLanguage, setMainLanguage] = useState('')
    const [learningLanguages, setLearningLanguages] = useState([])
    const [languageWithLevel, setLanguageWithLevel] = useState({})
    const [userIntroduce, setUserIntroduce] = useState('')
    const [hintModal, setHintModal] = useState(false)
    const [birthday, setBirthday] = useState('')
    const [nativeLanguageCode, setNativeLanguageCode] = useState('')

    const navigate = useNavigate()
    const handleChange = (nation) => {
        setNation(nation)
    }

    const handleLevelChange = (lang, level) => {
        setLanguageWithLevel({
          ...languageWithLevel,
          [lang]: { ...languageWithLevel[lang], level: parseInt(level,10) } // e.target.value로 저장한 level값은 항상 string으로 만들어줌으로, parseInt()를 통해 변환
        });
      };

    const handleSubmit = (e) => {
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
            birthday,
            nativeLanguageCode
        }

        if (Object.keys(selectedInterests).length === 0 ||
            !gender || name === '' || mainLanguage.language === '' ||
            Object.keys(learningLanguages).length === 0 || Object.keys(languageWithLevel).length === 0
            || nation === '' || birthday === ''
        ) {
            alert("All fields required")
            return false
        } else {
            console.log(formData)
            AddUserProfile(formData)
            .then(() => {
                window.location.reload(); // 성공 시 페이지 새로고침
            })
            .catch(error => {
                console.error("Error submitting form:", error);
            });
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
                            const langCode = languages.find(lang => lang.language == e.target.value)?.langCode || '';
                            setNativeLanguageCode(langCode)
                        }}>
                        <option disabled value=''>Select Your Main Language</option>
                        {languages.map(lang => {
                            return (
                                <option value={lang.language}>{lang.language}</option>
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
                <CheckboxButton $cliked={gender == "Female"} onClick={() => {
                    setGender("Female")
                }}>Female</CheckboxButton>
                <CheckboxButton $cliked={gender == "Male"} onClick={() => {
                    setGender("Male")
                }}>Male</CheckboxButton>
            </FormItemWrap>

            <FormItemWrap>
                <LabelText>Enter your birthday</LabelText>
                <Input
                    type='date'
                    value={birthday}
                    onChange={(e)=> {
                        setBirthday(e.target.value)
                    }}
                    />
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
                        if (!mainLanguage.includes(lang.language)) {
                            return (
                                <RadioButton
                                    $cliked={learningLanguages.includes(lang.language)}
                                    onClick={() => {
                                        if (!learningLanguages.includes(lang.language)) {
                                            setLearningLanguages([...learningLanguages, lang.language]);
                                            setLanguageWithLevel({
                                                ...languageWithLevel,
                                                [lang.language] : {langId : lang.langId,
                                                                    language : lang.language,
                                                                    level : null }
                                            })
                                        } else {
                                            const newLearningLanguages = learningLanguages.filter(item => item !== lang.language)
                                            setLearningLanguages(newLearningLanguages)
                                            const newLangaugeWithLevel = {
                                                ...languageWithLevel
                                            }
                                            delete newLangaugeWithLevel[lang.language]
                                            setLanguageWithLevel(
                                                newLangaugeWithLevel
                                            )
                                        }
                                    }}
                                >{lang.language}</RadioButton>
                            )
                        }
                    })}
                </div>
            </FormItemWrap>

            <FormItemWrap>
                {learningLanguages.map(lang => {
                    const thisLanguageLevel = languageWithLevel[lang]?.level || '';
                    return (
                        <div key={lang} style={{ display: 'flex', flexDirection: 'row' }}>
                            <LabelText>{lang}</LabelText>
                            <div style={{ flex: 1 }} />
                            <StyledSelect style={{ width: 'calc(80% - 12px)' }}                 //e.target.value는 항상 문자열을 반환한다.
                                value={thisLanguageLevel} onChange={(e) => handleLevelChange(lang, e.target.value)}> 
                                <option value="" disabled>Proficiency Level</option>
                                {[1, 2, 3, 4, 5, 6].map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </StyledSelect>
                        </div>
                    )

                })}
            </FormItemWrap>

            <FormItemWrap>
                <LabelText>Choose Your Interests <span>(up to 5 interests)</span></LabelText>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {interests.map(item => {
                        return (
                            <RadioButton $cliked={selectedInterests.hasOwnProperty(item.interestName)} // Object의 경우 includes() 대신 hasOwnProperty()사용
                                onClick={() => {
                                    if (!selectedInterests.hasOwnProperty(item.interestName) && Object.keys(selectedInterests).length < 5) {
                                        setSelectedInterests({...selectedInterests,
                                            [item.interestName] : {interestId : item.interestId,
                                                                    interestName : item.interestName
                                            }})
                                    } else {
                                        const newSelectedInterests = {...selectedInterests} //object의 경우 filter()를 사용할 수 없음
                                        delete newSelectedInterests[item.interestName] //filter()대신 객체의 키값을 delete
                                        setSelectedInterests(newSelectedInterests)
                                    }
                                }}
                            >{item.interestName}</RadioButton>
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