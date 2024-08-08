import React, { forwardRef, useEffect, useState } from "react";
import styled from "styled-components";
import { ChatMessage } from "../atoms/ChatMessage";
import ChatCard from "../templates/ChatSectionCard";
import BaseImage from "../atoms/BaseImage";
import { PRIMARY_COLOR } from "../../../consts/color";
import Button from "../atoms/Button";
const StyledChatCard = styled(ChatCard)`
    /* width: 450px; */
    /* height: 600px; */
    background-color: white;
    border: 2px solid #283593;
    overflow-y: auto;
    padding: 10px;
    border-radius: 8px;
    ::-webkit-scrollbar {
        width: 0px;
        background: transparent; /* make scrollbar transparent */
    }
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
`;


const QuizWrap = styled.div`
    // ${props => props.$correct == 1 && `
    //     background-color : green;
    //     `}
    // ${props => props.$correct == 2 && `
    //     background-color : red;
    //     color : white;
    //     `}
`
const Question = styled.div`
    padding : 8px 6px 8px 6px;
    font-size : 20px;
    font-weight : 550;
`
const QuizButton = styled.button`
        padding : 12px;
        width : 100px;
        border-radius : 6px;
    ${props => props.$button == 0 && `
        border : 2px solid #eee;
        `}
    ${props => props.$button == 1 && `
        border : 2px solid green;
        `}
    ${props => props.$button == 2 && `
        border : 2px solid red;
        `}
`


const QuizReason = styled.div`
    font-size : 16px;
    ${props => props.$type == 1 && `
        color : green;
        `}
    ${props => props.$type == 2 && `
        color : red;
        `}
`
const NextButton = styled(Button)`
    margin-top : 24px;
    padding: 8px 10px 8px 10px;
    width : 70%;
    font-size : 18px;
`
const OX = styled.div`
    font-weight : bold;
    font-size : 24px;
`
const YesNo = styled.div`
    font-weight : bold;
    font-size : 18px;
`

const ButtonWrap = styled.div`
    padding-top : 12px;
    display : flex;
    gap : 18%;
    justify-content : center;
    align-items : center;
`
const ScoreHeader = styled.div`
    font-weight : bold;
    font-size : 24px;
`
const Score = styled.div`
    font-size : 24px;
`
function QuizForm(props) {
    const { data, className } = props
    const [answer, setAnswer] = useState(0)
    const [quizIndex, setQuizIndex] = useState(0)
    const [clicked, setClicked] = useState(false)
    const [score, setScore] = useState(0)
    const [final, setFinal] = useState(false)

    useEffect(() => {
        console.log(answer)
        console.log('score', score)
    })
    if (!data || data.length === 0) {
        return <div>No quiz data available</div>;
      }
    
    return (
        <StyledChatCard className={className} >
            <QuizWrap>
                {final && (
                    <div style={{display : 'flex', justifyContent : 'center', alignItems : 'center'}}>
                    <ScoreHeader>Your Score : </ScoreHeader>
                    <Score><span style={{color : 'green'}}>{score}</span>/{data.length}</Score>
                    </div>
                )}

                {!final && (
                    <>
                        <h4 style={{ color: `${PRIMARY_COLOR}` }}>Quiz {quizIndex + 1}/{data.length}</h4>
                        <Question>{data[quizIndex].aiQuestion}</Question>
                        <ButtonWrap>
                            <QuizButton disabled={clicked} $button={answer} onClick={(e) => {
                                setClicked(true)
                                if (data[quizIndex].aiAnswer == 'O') {
                                    setAnswer(1)
                                    setScore(score + 1)
                                } else {
                                    setAnswer(2)
                                }
                            }}>
                                <OX>O</OX>
                                <YesNo>Yes</YesNo>
                            </QuizButton>

                            <QuizButton disabled={clicked} $button={answer} onClick={(e) => {
                                setClicked(true)
                                if (data[quizIndex].aiAnswer == 'X') {
                                    setAnswer(1)
                                    setScore(score + 1)
                                } else {
                                    setAnswer(2)
                                }
                            }}>
                                <OX>X</OX>
                                <YesNo>No</YesNo>
                            </QuizButton>
                        </ButtonWrap>

                        {answer == 1 && (
                            <div style={{ padding: '12px' }}>
                                <QuizReason $type={answer}>{data[quizIndex].aiReason}</QuizReason>
                            </div>
                        )}

                        {answer == 2 && (
                            <div style={{ padding: '12px' }}>
                                <QuizReason $type={answer}>{data[quizIndex].aiReason}</QuizReason>
                            </div>
                        )}

                        <div style={{ display: "flex", justifyContent: 'center' }}>
                            <NextButton onClick={() => {
                                setClicked(false)
                                if (quizIndex < data.length - 1 && answer !== 0) {
                                    setQuizIndex(quizIndex + 1)
                                    setAnswer(0)
                                } if (quizIndex == data.length - 1) {
                                    setFinal(true)
                                }
                            }}>Next</NextButton>
                        </div>
                    </>

                )}

            </QuizWrap>
        </StyledChatCard>

    )
}


export default QuizForm;