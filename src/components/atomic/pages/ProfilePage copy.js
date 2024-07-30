import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '../atoms/Button';
import { PRIMARY_COLOR } from '../../../consts/color'



const Container = styled.div`
    background-color : #eee;
    max-width : 800px;
    width : 100%;
    margin-right : auto;
    margin-left : auto;
    
`
const Wrap = styled.form`
`

const Title = styled.div`
    font-size : 42px;
    font-weight : bold;
    text-align : center;
`
const Selector = styled.div`
    padding : 4px;
`
const StyledLi = styled.li`
    margin : 2px 2px;
`
const StyledInput = styled.input`
    // border : 1px solid black;
    // border-radius : 6px;
    // padding : 4px;
    // width : calc(80% - 12px);
    --bs-form-select-bg-img: url(data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e);
    display: block;
    width: 100%;
    padding: .375rem 2.25rem .375rem .75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: var(--bs-body-color);
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: var(--bs-body-bg);
    background-image: var(--bs-form-select-bg-img), var(--bs-form-select-bg-icon, none);
    background-repeat: no-repeat;
    background-position: right .75rem center;
    background-size: 16px 12px;
    border: var(--bs-border-width) solid var(--bs-border-color);
    border-radius: var(--bs-border-radius);
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
`
const StyledSelector = styled.select`
    --bs-form-select-bg-img: url(data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e);
    display: block;
    width: 100%;
    padding: .375rem 2.25rem .375rem .75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: var(--bs-body-color);
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: var(--bs-body-bg);
    background-image: var(--bs-form-select-bg-img), var(--bs-form-select-bg-icon, none);
    background-repeat: no-repeat;
    background-position: right .75rem center;
    background-size: 16px 12px;
    border: var(--bs-border-width) solid var(--bs-border-color);
    border-radius: var(--bs-border-radius);
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;

` 

const StyledDiv = styled.div`
    margin-left : auto;
    margin-right : auto;
`
const StyledButton = styled.div`
    text-align : center;
    margin-right : 12px;
    width : 100%;
    padding : 4px;
    border : 1px solid black;
    border-radius : 8px;
    cursor: pointer;
`
const StyledTextarea = styled.textarea`
    width : calc(80% - 12px);
    resize : none;
    border : 1px solid black;
    border-radius : 6px;
`
const NextButton = styled(Button)`

`
const LevelButton = styled.div`
    margin: 2px;
    padding: 4px 8px;
    border: 1px solid black;
    border-radius: 6px;
    cursor: pointer;
`;


const options = ['English', 'Spanish', 'French', 'German', 'Korean', 'Japanese', 'Chinese']
const interests = ['Traveling', 'Reading', 'Cooking', 'Hiking', 'Photography', 'Music', 'Movies', 'Fitness', 'Technology',
    'Gaming', 'Art', 'Dancing', 'Writing', 'Learning Languages', 'Cycling', 'Yoga', 'Meditation', 'Gardening', 'Fishing', 'Crafting', 'Volunteering', 'Sports',
    'Fashion', 'Food Tasting', 'History', 'Astronomy', 'Blogging', 'Podcasts', 'Theater',
    'DIY Projects']
const gender = ['Male', 'Female']

export default props => {
    const [currentPage, setCurrentPage] = useState(1) // 현재 페이지
    const [selectedMainLanguage, setSelectedMainLanguage] = useState('English')
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedLevels, setSelectedLevels] = useState({});
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [selectedGender, setSelectedGender] = useState('Male');
    const [userName, setUserName] = useState('');
    const [selfIntroduction, setSelfIntroduction] = useState('');

    const handleSelectOption = (option) => {
        if (selectedOptions.includes(option)) {
            const newSelectedOptions = selectedOptions.filter(item => item !== option);
            const newSelectedLevels = {...selectedLevels};
            delete newSelectedLevels[option];
            setSelectedOptions(newSelectedOptions);
            setSelectedLevels(newSelectedLevels)
        } else {
            const newSelectedOptions = [...selectedOptions, option]
            setSelectedOptions(newSelectedOptions);
        }
    };

    const handleSelectedLevels = (option, level) => {
        setSelectedLevels({
            ...selectedLevels,
            [option] : level
        })
    }

    const getOptionStyled = (option) => {
        return selectedOptions.includes(option) ? { background: `${PRIMARY_COLOR}`, color: 'white' } : {background : 'white'}
    }

    const getInterestStyled = (interest) => {
        return selectedInterests.includes(interest) ? { background: `${PRIMARY_COLOR}` , color: 'white' } : {background : 'white'}
    }

    const handleSelectInterest = (interest) => {
        if (selectedInterests.includes(interest)) {
            const newSelectedInterests = selectedInterests.filter(item => item !== interest);
            setSelectedInterests(newSelectedInterests);
        } else if(selectedInterests.length < 5) {
             const newSelectedInterests = [...selectedInterests, interest]
            setSelectedInterests(newSelectedInterests);
        } else {
            alert("You can slecet up to 5 interests only.")
        }
    };

    const handleSelectedGender = (event) => {
        setSelectedGender(event.target.value)
    }

    const handleSelectedMainLanguage = (event) => {
        setSelectedMainLanguage(event.target.value)
    }

    const handleUserName = (event) => {
        setUserName(event.target.value)
    }

    const handleSelfIntroduction = (event) => {
        setSelfIntroduction(event.target.value)
    }

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1)
    };

    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1)
    }

    const handleSubmit =(e) => {
        e.preventDefualt();

        const formData = new FormData();
        formData.append('userName', userName);
        formData.append('selectedMainLanguage', selectedMainLanguage);
        formData.append('selectedGender', selectedGender);
        formData.append('selfIntroduction', selfIntroduction);
        selectedOptions.forEach((option, index)=>{
            formData.append(`selectedOptions[${index}]`, option);
            formData.append(`selectedLevels[${option}]`, selectedLevels[option]);
        });
        selectedInterests.forEach((interest, index) => {
            formData.append(`selectedInterests[${index}]`, interest);
        });

        fetch('/submit', {
            method:'POST',
            body:formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data)
        })
        .catch((error)=> {
            console.error('Error:',error)
        })
    }

    return (
        <Container>
            <Wrap onSubmit={handleSubmit}>
                <Title>Create User Profile</Title>
                {currentPage === 1 && (
                    <>
                    <StyledDiv>
                        <StyledInput
                            placeholder='Enter your name'
                            onChange={handleUserName}
                            value={userName}
                        ></StyledInput>
                        </StyledDiv>
                        <Selector>
                            Choose your Main Language
                            <StyledSelector onChange={handleSelectedMainLanguage} value={selectedMainLanguage}>
                                {options.map(item => {
                                    return <option value={item}>{item}</option>
                                })
                                }
                            </StyledSelector>
                        </Selector>
                        <Selector>
                            Select your gender
                            <select onChange={handleSelectedGender} value={selectedGender}>
                                {gender.map(item => {
                                    return <option value={item}>{item}</option>
                                })

                                }
                            </select>
                        </Selector>
                        <NextButton $type="bordered-filled" type='button' onClick={handleNextPage}>Next</NextButton>
                    </>
                )}

                {currentPage === 2 && (
                    <>
                        <Selector>
                            <p>Choose your learning language</p>
                            <p style={{fontWeight:'light', fontSize : '14px'}}>Numbers from 1 to 6 indicate language proficiency, with lower numbers for beginners and higher numbers for advanced users</p>
                            <ul style={{ display: 'flex', flexWrap:'wrap'}}>
                                {options.map((option, index) => (
                                    <StyledLi key={index}>
                                        <StyledButton  
                                        onClick={() => handleSelectOption(option)}
                                        style={getOptionStyled(option)}>
                                            {option}
                                        </StyledButton>
                                        {selectedOptions.includes(option)&&(
                                            <div>
                                                {[1,2,3,4,5,6].map(level => {
                                                    return <LevelButton
                                                            key={level}
                                                            onClick={()=>handleSelectedLevels(option,level)}
                                                            style={selectedLevels[option] === level ?
                                                            { background: 'green', color: 'white' } : {}}
                                                    >{level}</LevelButton>
                                                })}
                                            </div>

                                        )}
                                    </StyledLi>
                                ))}
                            </ul>
                        </Selector>
                        <Selector>Choose your interest (up-to 5)
                            <ul style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {interests.map((interest, index) => (
                                    <StyledLi key={index} onClick={() => handleSelectInterest(interest)}>
                                        <StyledButton  style={getInterestStyled(interest)}>
                                            {interest}</StyledButton>
                                    </StyledLi>
                                ))}
                            </ul>
                        </Selector>

                        <StyledTextarea onChange={handleSelfIntroduction} placeholder='Introduce your self!'>
                        </StyledTextarea>
                        <NextButton $type="bordered-filled" type='button' onClick={handlePrevPage}>Back</NextButton>
                        <NextButton $type="bordered-filled" type='submit'> Submit</NextButton>
                    </>
                )}

            </Wrap>
        </Container>
    )
}