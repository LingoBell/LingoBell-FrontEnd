

import React, { useState } from 'react'
import styled from 'styled-components'

const languages = ['English', 'Spanish', 'French', 'German', 'Korean', 'Japanese', 'Chinese']
const interests = ['Traveling', 'Reading', 'Cooking', 'Hiking', 'Photography', 'Music', 'Movies', 'Fitness', 'Technology',
    'Gaming', 'Art', 'Dancing', 'Writing', 'Learning Languages', 'Cycling', 'Yoga', 'Meditation', 'Gardening', 'Fishing', 'Crafting', 'Volunteering', 'Sports',
    'Fashion', 'Food Tasting', 'History', 'Astronomy', 'Blogging', 'Podcasts', 'Theater',
    'DIY Projects']
const gender = ['Male', 'Female']
// const FormItem = props => {
//     return (
//         <Label htmlFor={props.htmlFor} className={props.className}>
//             <LabelName>{props.d}</LabelName>
//             {
//                 props.type == 'input' && (
//                     <Input id={props.htmlFor} onChange={props.onChange} value={props.value} />
//                 )
//             }
//             {
//                 props.type == 'select' && (
//                     <Select onChange={props.onChange} value={props.value} options={props.options} />
//                 )
//             }
//             {
//                 props.type == 'radio' && (
//                     <RadioWrap>
//                         {
//                             props.options.map(option => {
//                                 return (
//                                     <>
//                                         <input type='radio' value={option.value}></input>
//                                         {
//                                             option.label
//                                         }
//                                     </>
//                                 )
//                             })
//                         }
//                     </RadioWrap>
//                 )
//             }
//         </Label>
//     )
// }

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
    const [learningLanguages, setLearningLanguages] = useState(['English'])

    // const [languageWithLevel , setLanguageWithLevel] = useState({})    
    const [languageWithLevel, setLanguageWithLevel] = useState({
        English: 6,
        French: 5
    })
    // 
    const changeSwCho = () => {

    }
    return (
        <Wrap>
            <FormItemWrap>
                <LabelText>Name</LabelText>
                <Input value={name} onChange={(e)=>{
                    setName(e.target.value)
                }}/>
            </FormItemWrap>
            <FormItemWrap>
                <LabelText>Main Language</LabelText>
                <Select value={mainLanguage} onChange={e => {
                    // event에 대해서 공부할 것
                    setMainLanguage(e.target.value)
                }}>
                    <option disabled value=''>Choose Your Main Language</option> 
                    {/* value = '' 는 기본값을 맞추기 위해서, disabled된 경우 첫번째 option 이 선택되어있지 않게 됨 */}
                    {
                        languages.map(language => {
                            return (
                                <option value={language}>{language}</option>
                            )
                        })
                    }
                </Select>
            </FormItemWrap>
            <FormItemWrap style={{flexDirection: 'row'}}>
                <LabelText>성별</LabelText>
                <div style={{flex: 1}} />
                {/* {
                    [
                        {
                            gender: 1,
                            title: '여자'
                        },
                        {
                            gender: 2,
                            title: '남자'
                        },
                        
                    ].map(gd => {
                        return <RadioButton swcho={gd.gender == gender} onClick={()=>{
                            setGender(gd.gender)
                        }}>{gd.title}</RadioButton>
                    })
                } */}
                <RadioButton swcho={gender == 1} onClick={()=>{
                    setGender(1)
                }}>여자</RadioButton>
                <RadioButton swcho={gender == 2} onClick={()=>{
                    setGender(2)
                }}>남자</RadioButton>
                
            </FormItemWrap>

            
            <FormItemWrap>
                <LabelText>Learning Language</LabelText>
                <div style={{display: 'flex', }}>
                    {
                        languages.map(language => {
                            if (language == mainLanguage) {
                                return null
                            }
                            return (
                                <CheckboxButton swcho={learningLanguages.includes(language)}
                                onClick={()=>{
                                    if(!learningLanguages.includes(language)){
                                    setLearningLanguages([...learningLanguages, language])
                                    } else {
                                        const newLearningLanguages = learningLanguages.filter(item => item !== language)
                                        setLearningLanguages(newLearningLanguages)
                                    }
                                }}>{language}</CheckboxButton>
                            )
                        })
                    }
                </div>
            </FormItemWrap>
            
        
                    { learningLanguages.map(language => {
                        const thisLanguageLevel = languageWithLevel[language] || 1
                                
                        return (
                            <FormItemWrap  style={{flexDirection: 'row'}}>
                            <LabelText>{language}</LabelText>
                            <Select
                                value={thisLanguageLevel}
                                onChange={(event)=>  {
                                    const level = event.target.value
                                    console.log({
                                        ...languageWithLevel,
                                        [language] : level
                                    })
                                    
                                    // const newLanguageWithLevel = {
                                    //    ...languageWithLevel
                                    // }

                                    setLanguageWithLevel (
                                        {
                                            ...languageWithLevel, 
                                            [language]: level
                                        }
                                    )

                                }}
                            >
                            {
                                [1,2,3,4,5,6].map(item =>
                                    <option value={item}>{item}</option>
                                )
                            }
                            </Select>
                        </FormItemWrap>
                        )
                        
                    })
                    }

            
                <FormItemWrap>
                    <LabelText>Choose Your Interests</LabelText>
                    <div style={{display : 'flex', flexWrap : 'wrap'}}>
                    {
                        interests.map(item =>{
                            return (
                                <CheckboxButton swcho={selectedInterests.includes(item)} onClick={()=>{
                                    if(!selectedInterests.includes(item)){
                                        setSelectedInterests([...selectedInterests, item])
                                    } else {
                                        const newSelectedInterests = selectedInterests.filter((x) => x !== item )
                                        setSelectedInterests(newSelectedInterests)
                                    }
                                }}>{item}</CheckboxButton>
                            )
                        })
                    }        
                    </div>
                </FormItemWrap>
            

        </Wrap>
    )
}