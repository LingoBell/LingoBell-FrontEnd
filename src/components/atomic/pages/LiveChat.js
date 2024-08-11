import React, { useEffect, useRef, useState } from "react";
import ChatForm from "../molecules/ChatForm";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { USER_SAMPLE_DATA } from "../../../consts/sampleData";
import CenteredMainLayout from "../templates/CenteredMainLayout";
import axios from "axios";
import Video from "./Video";
import { useNavigate, useParams } from "react-router-dom";
import { CreateQuizzes, CreateRecommendations, GetQuizzes, GetQuizzez, GetRecommendations, getChatRoomStatus, getSttMessages } from "../../../apis/ChatAPI";
import { PRIMARY_COLOR } from "../../../consts/color";
import QuizForm from "../molecules/QuizForm";

const MainStyle = createGlobalStyle`
    #root > main {
        height: 100vh;
    }
`
const StyledCenteredLayout = styled(CenteredMainLayout)`
    height: 100%;
    padding-bottom: 57px;
    overflow:hidden;
    @media screen and (min-width: 1024px) {
        padding: 16px;
    }
`
const LiveChatWrap = styled.div`
    display: flex;
    flex-direction: column;
    /* padding: 15px; */
    /* gap: 16px; */
    height: 100%;
    @media screen and (min-width: 1024px) {
        flex-direction: row;
        gap: 16px;
    }
`

const CommonWrap = styled.div`
    width: 33.33333333%;
`

const AIChatWrap = styled.div`
    position : relative;
    display : flex;
    flex-direction : column;
    flex: 1;
    @media screen and (max-width: 1023px) {
        height: 300px;
        max-height: 300px;
        overflow: auto;
        display: ${props => props.isOpen ? `block` : 'none'}
    }
    @media screen and (min-width: 1024px) {
        order: 1; 
        width: 30%;
    }
`

const VideoWrap = styled.div`
    
    display: flex;
    flex-direction: row;
    flex: 1;
    @media screen and (min-width: 1024px) {
        display: flex;
        width: 40%;
        flex-direction: column;
        gap: 16px;
        order: 2;
    }
`

const CommonVideo = styled.video`
    /* width: 100%; */
    flex: 1;
    width: 50%;
    height: 100%;
    @media screen and (min-width: 1024px) {
        border-radius: 8px;
        
        width: 100%;
    }
`

const Video1 = styled(CommonVideo)`
    background-color: blue;
`

const Video2 = styled(CommonVideo)`
    background-color: red;
`

const UserChatWrap = styled.div`
    @media screen and (max-width: 1023px) {
        height: 300px;
        min-height: 300px;
        display: ${props => props.isOpen ? `block` : 'none'}
    }
    @media screen and (min-width: 1024px) {
        width: 30%;
        order: 3;
    }

    /* display: none; */
`

const StyledChatForm = styled(ChatForm)`
    height: 100%;
    border-radius: 0;
    @media screen and (min-width: 1024px) {
        border-radius: 8px;
    }
`

const StyledQuizForm = styled(QuizForm)`
`

const ButtonWrap = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    background-color: white;
    padding-top: 8px;
    padding-bottom: 8px;
    display: flex;

    align-items: center;
    align-items: center;
    justify-content: space-around;
    border-top: 1px solid #eee;
    background-color: #111;
    @media screen and (min-width:1024px) {
        position: static;
        background-color: white;
        /* color: white; */
        padding-top: 0;
        padding-bottom: 0;
        border-top: 0;
    }
`

const CallButton = styled.button`
    width: 40px;
    height: 40px;
    background-color: transparent;
    color: white;
    @media screen and (min-width: 1024px) {
        width: 60px;
        height: 60px;
        color: #111;
    }
`

const CallEndButton = styled(CallButton)`
    border-radius: 30px;
    background-color: #FF0000;
    color: white !important;
`
const AiButton = styled.div`
    background-color : ${PRIMARY_COLOR};
    padding : 6px;
    margin-bottom : 12px;
    border-radius : 6px;
    color : white;
    cursor : pointer;
`
const AiButtonWrap = styled.div`
    display : flex;
    justify-content : space-between;
`
const LoadingOverlay = styled.div`
    position : absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;


const Loader = styled.div`
    border: 8px solid #f3f3f3;
    border-top: 8px solid ${PRIMARY_COLOR};
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: ${spin} 2s linear infinite;
`;

//퀴즈모달
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const QuizModal = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    max-width: 500px;
    position: relative;
    z-index: 1001;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 16px;
    cursor: pointer;
`;




function LiveChat() {
    const [openedTab, setOpenedTab] = useState('AI')
    const [messages, setMessages] = useState([]);
    const [showTranslation, setShowTranslation] = useState(true);
    const { chatId: chatRoomId } = useParams()
    const timestamp = new Date().toISOString();
    const [recommendation, setRecommendation] = useState([])
    const [quiz, setQuiz] = useState([])
    const [quizModal, setQuizModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const aiChatWrapRef = useRef(null)
    const audioRef = useRef(null);
    const videoRef = useRef(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(false); // 초기 비디오 비활성화
    const [isMaskOn, setIsMaskOn] = useState(true);

    const navigate = useNavigate()
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const data = await getSttMessages(chatRoomId);
                setMessages(data.messages);
            } catch (err) {
                console.error('Error fetching STT messages on LiveChat useEffect', err);
            }
        };

        const intervalId = setInterval(fetchMessages, 1000);
        return () => clearInterval(intervalId);
    }, [chatRoomId]);


    // const send_notification = async () => {
    //     try {
    //         const result = await axios.get(`/chats/${chatRoomId}/info`)
    //         console.log('ddd', result)
    //     } catch (error) {
    //         console.error('Error creating recommendations', err)
    //     }
    // }
        
    // useEffect(() => {
    //     send_notification(chatRoomId)
    // }, [chatRoomId]);


    // useEffect(()=>{

    //     const fetchChatRoomStatus = async() => {
    //         try {
    //             const joinStatus = await getChatRoomStatus(chatRoomId)
    //             console.log('iiiii',joinStatus)
    //         } catch(error) {
    //             console.log(error)
    //         }
    //     }
    //     fetchChatRoomStatus()
    // },[]) 이거하던부분

    const fetchAiRecommendations = async () => {
        const recommendData = await GetRecommendations(chatRoomId);
        const newRecommendData = recommendData.map(item => ({
            ...item, type: 'ai'
        }))
        console.log('newRecommendData:', newRecommendData)
        setRecommendation(newRecommendData)
    }

    const fetchAiQuizzes = async () => {
        console.log('Fetching AI Quizzes'); // 로그 추가

        const quizData = await GetQuizzes(chatRoomId);
        const newQuizData = quizData.map(item => ({
            ...item, type : 'quiz'
        }))
        console.log('newQuizData:',newQuizData)
        setQuiz(newQuizData)
    }

    useEffect(() => {
        fetchAiRecommendations()
        fetchAiQuizzes()

    }, [chatRoomId])

    const requestRecommendations = async () => {
        setLoading(true);
        try {
            const result = await CreateRecommendations(chatRoomId)
            console.log('ddd', result)
            await fetchAiRecommendations()
        } catch (error) {
            console.error('Error creating recommendations', err)
        } finally {
            setLoading(false)
            setTimeout(() => {
                aiChatWrapRef.current?.scrollTo({
                    top: 999999999999999999,
                    behavior: 'smooth'
                }) 
            }, 300)
            
        }
    }

    const requestQuizzes = async () => {
        setQuizModal(true);
        setLoading(true);
        try{
            const result = await CreateQuizzes(chatRoomId)
            console.log('ququququ', result)
            await fetchAiQuizzes()
        } catch(error) {
            console.error('Error getting quizzes', error)
        } finally {
            setLoading(false)
        }
    }

    console.log('wwww',quiz)

    const toggleTranslation = () => {
        setShowTranslation(!showTranslation);
    };

    const handleAudioClick = () => {
        if (videoRef.current) {
            videoRef.current.turnAudio();
        }
    }

    const handleVideoClick = () => {
        if (videoRef.current) {
            videoRef.current.turnVideo();
        }
    }
    
    const handleEndCall = () => {
        if(videoRef.current) {
            videoRef.current.endCall();
            navigate('/')
            
        }
    }

    const handleAudioStatusChange = (status) => {
        setIsAudioEnabled(status);
    }

    const handleVideoStatusChange = (status) => {
        setIsVideoEnabled(status);
    }

    const toggleMask = () => {
        setIsMaskOn(!isMaskOn);
    };

    return (
        <StyledCenteredLayout>
            <MainStyle />
            <LiveChatWrap>
                <VideoWrap>
                    <Video
                        ref={videoRef}
                        onAudioStatusChange={handleAudioStatusChange}
                        onVideoStatusChange={handleVideoStatusChange}
                        isMaskOn={isMaskOn}
                    />
                    <ButtonWrap>
                        <CallButton onClick={handleAudioClick}>
                            <span className='material-icons'>
                                {isAudioEnabled ? 'mic' : 'mic_off'}
                            </span>
                        </CallButton>
                        <CallButton onClick={handleVideoClick}>
                            <span className='material-icons'>
                                {isVideoEnabled ? 'videocam' : 'videocam_off'}
                            </span>
                        </CallButton>
                        <CallEndButton onClick={handleEndCall}>
                            <span className='material-icons'>call_end</span>
                        </CallEndButton>
                        <CallButton onClick={startTranscription}><span className='material-icons'>translate</span></CallButton>
                        <CallButton onClick={toggleMask}>
                            <span className='material-icons'>
                                {isMaskOn ? 'face' : 'face_retouching_off'}
                            </span>
                        </CallButton>
                        <CallButton><span className='material-icons'>calendar_month</span></CallButton>
                    </ButtonWrap>
                </VideoWrap>
                <AIChatWrap isOpen={openedTab === 'AI'}>
                    {loading && (
                        <LoadingOverlay>
                            <Loader />
                        </LoadingOverlay>
                    )}
                    <AiButtonWrap>
                        <AiButton
                            onClick={requestRecommendations}
                        >Topic genereate</AiButton>
                        <AiButton
                            onClick={requestQuizzes}
                        >Quiz genereate</AiButton>
                    </AiButtonWrap>
                    <StyledChatForm ref={aiChatWrapRef} // id={'aiChatList'}
                        data={recommendation}>
                    </StyledChatForm>
                </AIChatWrap>
                <UserChatWrap isOpen={openedTab === 'USER'}>
                    <StyledChatForm data={messages.map((msg) => ({
                        ...msg,
                        translatedMessage: showTranslation ? msg.translatedMessage : ''
                    }))} />
                </UserChatWrap>
            </LiveChatWrap>
            {!loading && quizModal && (
                <ModalOverlay>
                    <QuizModal>
                        <CloseButton onClick={()=>{
                            setQuizModal(false)
                        }}>x</CloseButton>
                        <StyledQuizForm data={quiz?.slice(-5)}/>
                        {console.log('Quiz data passed to QuizForm:', quiz.slice(-5))}
                    </QuizModal>
                </ModalOverlay>
            )}
        </StyledCenteredLayout>
    );
};

export default LiveChat;