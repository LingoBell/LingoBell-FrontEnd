import React, { useEffect, useRef, useState } from "react";
import ChatForm from "../molecules/ChatForm";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { USER_SAMPLE_DATA } from "../../../consts/sampleData";
import CenteredMainLayout from "../templates/CenteredMainLayout";
import axios from "axios";
import Video from "./Video";
import { useNavigate, useParams } from "react-router-dom";
import { CreateQuizzes, CreateRecommendations, GetQuizzes, GetQuizzez, GetRecommendations, getChatRoomStatus, getSttAndTranslatedMessages } from "../../../apis/ChatAPI";
import { PRIMARY_COLOR } from "../../../consts/color";
import QuizForm from "../molecules/QuizForm";
import BaseImage from "../atoms/BaseImage";
import _ from "lodash";
import useSTT from "./STT";
import { useSelector } from "react-redux";

const MainStyle = createGlobalStyle`
    #root > main {
        height: 100vh;
    }
`
const StyledCenteredLayout = styled(CenteredMainLayout)`
    height: 100%;
    width : 100vw;
    padding-bottom: 57px;
    overflow: auto;
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
    width : 100%;
    @media screen and(min-width : 600px) {
        flex-direction : column;
    }

    @media screen and (min-width: 1024px) {
        flex-direction: row;
        gap: 16px;
    }
`

const CommonWrap = styled.div`
    width: 33.33333333%;
`

const AIChatWrap = styled.div`
    transform : translateY(-2000px);
    position : relative;
    display : flex;
    flex-direction : column;
    flex: 1;
    min-width : 30%;
    order : 2;
    // display: ${props => props.isOpen ? `block` : 'none'}
    @media screen and (min-width : 600px) {
    transform : translateY(0);
        order : 1;
        width : 50%;
        overflow : auto;

    }
    @media screen and (min-width: 1024px) {
    transform : translateY(0);
        order: 1; 
        min-width : 30%;
        width: 30%;
        height : 100%;
        overflow : auto;
    }
`

const UserChatWrap = styled.div`
    transform : translateY(-2000px);
    @media screen and (min-width : 600px) {
    transform : translateY(0);
        order : 2;
        width: 50%;
        overflow : auto;
        /* margin-bottom :50px; */
        margin-top: 34px;
        // display: ${props => props.isOpen ? `block` : 'none'}
    }
    @media screen and (min-width: 1024px) {
    transform : translateY(0);
        width: 30%;
        height : 100%;
        order: 3;
        overflow : auto;
        margin-top : 0;

    }

    /* display: none; */
`

const VideoWrap = styled.div`
    display : flex;
    flex-direction : column;
    height : 100%;
    order : 1;

    @media screen and (min-width :600px) {
        width : 100%;
        display: flex;
        flex-direction: row;
        flex: 1;
        max-height: 240px;
        order : 1;
    }

    @media screen and (min-width: 1024px) {
        display: flex;
        width: 40%;
        flex-direction: column;
        gap: 16px;
        flex: auto;
        order: 2;
        max-height: 100%;
        height : calc(100vh - 92px);
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

const StyledChatForm = styled(ChatForm)`
    height: 100%;
    border-radius: 8px;
    @media screen and (min-width : 600px) {
        // height : 300px;
    }
    @media screen and (min-width: 1024px) {
        border-radius: 8px;
        min-heigth : 100%;
    }
`

const StyledQuizForm = styled(QuizForm)`
`

const ButtonWrap = styled.div`
    position: fixed;
    bottom: 0;
    z-index: 2;
    left: 0;
    right: 0;
    width: 100%;
    padding-top: 8px;
    padding-bottom: 8px;
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
    margin-bottom : 6px;
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

const MaskButton = styled(BaseImage)`
    width: 24px;
    height: 24px;
    padding: 4px;
    transition: transform 0.3s ease;
    cursor: pointer;

  &:hover {
    transform: scale(1.4);
  }

    
`

const HoverWrap = styled.div`
    display : flex;
    justify-content : space-evenly;
    padding : 6px;

`

const ResponsiveChat = styled.div`


    @media screen and (min-width : 600px) and (max-width : 1023px) {
        display : flex;
        gap: 2px;
        position: relative;
        top: 0;
        width : 100%;
        margin-top: 20px;
        height: calc(50vh - 53px);
        flex-direction : row;
        order : 2;

    }
    
   
`


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
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true); // 초기 비디오 비활성화
    const [isMaskOn, setIsMaskOn] = useState(true);
    const [responsive, setResponsive] = useState(false)
    const maskRef = useRef(null);

    const { user } = useSelector((state) => state.user);
    const userId = user?.uid;

    const {
        isConnected,
        isRecording,
        transcription,
        detectedLanguage,
        processingTime,
        error,
        connectWebsocket,
        startRecording,
        stopRecording
    } = useSTT(userId, chatRoomId);

    const navigate = useNavigate();

    // useEffect(() => {
    //     const fetchMessages = async () => {
    //         try {
    //             const data = await getSttAndTranslatedMessages(chatRoomId);
    //             setMessages(data.messages);
    //             // document.querySelector('#user-chat-form-wrap')?.scrollTo({
    //             //     top: 999999999999999999,
    //             //     behavior: 'smooth'
    //             // })

    //         } catch (err) {
    //             console.error('Error fetching STT messages on LiveChat useEffect', err);
    //         }
    //     };

    //     const intervalId = setInterval(fetchMessages, 1000);
    //     return () => clearInterval(intervalId);
    // }, [chatRoomId]);

    useEffect(() => {
        console.log('transcription', transcription);
        if (transcription.length > 0) {
            const latestTranscription = transcription[transcription.length - 1];
            const newMessage = {
                messageSenderId: userId,
                originalMessage: latestTranscription.map(word => word.word).join(' '),
                translatedMessage: '',  // 번역 로직이 필요하다면 여기에 추가
                type: userId === user.uid ? 'me' : 'partner'
            };
            setMessages(prev => [...prev, newMessage]);
            console.log('message', messages);
        }
    }, [transcription, userId, user.uid]);

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
            ...item, type: 'quiz'
        }))
        console.log('newQuizData:', newQuizData)
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
            console.error('Error creating recommendations', error)
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
        try {
            const result = await CreateQuizzes(chatRoomId)
            console.log('ququququ', result)
            await fetchAiQuizzes()
        } catch (error) {
            console.error('Error getting quizzes', error)
        } finally {
            setLoading(false)
        }
    }

    // console.log('wwww',quiz)

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
        if (videoRef.current) {
            videoRef.current.endCall();
            navigate('/');
            window.location.reload();
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

    const handleMaskClick = (value) => {
        if (videoRef.current) {
            videoRef.current.changeSelection(value); // 자식 컴포넌트의 메서드를 호출
        }
    };


    const maskList = [
        { src: 'https://storage.googleapis.com/lingobellstorage/Hamzzi.png', value: 'image1' },
        { src: 'https://storage.googleapis.com/lingobellstorage/actionmask.jpeg', value: 'image2' },
        { src: 'https://storage.googleapis.com/lingobellstorage/bonobono.png', value: 'image3' },
        { src: 'https://storage.googleapis.com/lingobellstorage/staria.png', value: 'image4' },
        { src: 'https://storage.googleapis.com/lingobellstorage/gaksital.png', value: 'image5' },
        { src: 'https://storage.googleapis.com/lingobellstorage/Joker.jpeg', value: 'image6' }
    ]


    useEffect(() => {
        // 600 ~ 1023px 사이에서 레이아웃 조건부 변화 
        const handleResize = _.throttle(() => {
            const width = window.innerWidth;
            if (width >= 600 && width <= 1023) {
                setResponsive(true)
            } else {
                setResponsive(false)
            }
        }, 200) // 지연시간 -> debounce는 200ms 동안 크기가 변경되지 않으면 마지막에 한 번만 실행
        // throttle은 200ms 간격으로 실행
        handleResize()


        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, [])



    return (
        <StyledCenteredLayout>
            <MainStyle />
            <LiveChatWrap>
                {/* 중앙 비디오 폼 */}
                <VideoWrap>
                    <Video
                        ref={videoRef}
                        onAudioStatusChange={handleAudioStatusChange}
                        onVideoStatusChange={handleVideoStatusChange}
                        isMaskOn={isMaskOn}
                    />
                    {/* 챗폼 버튼 */}
                    <ButtonWrap>
                        <HoverWrap
                        >
                            {maskList.map((mask, index) =>
                                <MaskButton
                                    key={index}
                                    src={mask.src}
                                    onClick={() => {
                                        handleMaskClick(mask.value)
                                    }} />
                            )}
                        </HoverWrap>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
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
                            <CallButton onClick={toggleTranslation} style={{ position: 'relative', display: 'inline-block', fontSize: '24px' }}>
                                <span className="material-icons" style={{ fontSize: 'inherit' }}>
                                    translate
                                </span>
                                {!showTranslation && (
                                    <span
                                        style={{
                                            position: 'absolute',
                                            top: '45%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%) rotate(45deg)',
                                            height: '2px',
                                            width: '55%',
                                            backgroundColor: 'black',
                                        }}
                                    />
                                )}
                            </CallButton>
                            <CallButton onClick={toggleMask}
                            >
                                <span className='material-icons'>
                                    {isMaskOn ? 'face' : 'face_retouching_off'}
                                </span>
                            </CallButton>
                            <CallButton onClick={connectWebsocket} disabled={isConnected}>
                                <span className='material-icons'>
                                    {isConnected ? 'link' : 'link_off'}
                                </span>
                            </CallButton>
                            <CallButton onClick={isRecording ? stopRecording : startRecording}>
                                <span className='material-icons'>
                                    {isRecording ? 'stop' : 'mic'}
                                </span>
                            </CallButton>
                        </div>
                    </ButtonWrap>
                </VideoWrap>



                {responsive && ( // 600 ~ 1023px일때 다른 레이아웃)
                    <>
                        <ResponsiveChat>
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
                            {/* 유저 스크립트 폼 */}
                            <UserChatWrap isOpen={openedTab === 'USER'}>
                                <StyledChatForm id='user-chat-form-wrap' data={messages.map((msg) => ({
                                    ...msg,
                                    translatedMessage: showTranslation && msg.translatedMessage ? msg.translatedMessage : null
                                }))} />
                            </UserChatWrap>
                        </ResponsiveChat>
                    </>
                )}

                {!responsive && (
                    <>
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
                            <StyledChatForm id='user-chat-form-wrap' data={messages.map((msg) => ({
                                ...msg,
                                translatedMessage: showTranslation && msg.translatedMessage ? msg.translatedMessage : null
                            }))} />
                        </UserChatWrap>
                    </>
                )}

            </LiveChatWrap>
            {!loading && quizModal && (
                //퀴즈모달
                <ModalOverlay>
                    <QuizModal>
                        <CloseButton onClick={() => {
                            setQuizModal(false)
                        }}>x</CloseButton>
                        <StyledQuizForm data={quiz?.slice(-5)} />
                        {console.log('Quiz data passed to QuizForm:', quiz.slice(-5))}
                    </QuizModal>
                </ModalOverlay>
            )}
        </StyledCenteredLayout>
    );
};

export default LiveChat;