import React from "react";
import styled from "styled-components";
import { ChatMessage } from "../atoms/ChatMessage";
import { ORIGINAL_PARTNER_MESSAGE } from "../atoms/Color";

function ChatForm() {

    const data = [
        {
            type: 'partner',
            messageSenderId: 961223,
            originalMessage: 'How was your day today?',
            traslatedMessage: '오늘 어땠어?'
        },
        {
            type: 'me',
            messageSenderId: 950326,
            originalMessage: 'I had a pretty normal day. Just went to work and came back home.',
            traslatedMessage: '오늘 하루는 그냥 그랬어. 일하고 다시 퇴근했어.'
        },
        {
            type: 'ai',
            aiMessageType: 'topic',
            aiMessageContents: '오늘 어떤 하루를 보냈는지 물어보세요!'
        },
        {
            type: 'ai',
            aiMessageType: 'expression',
            aiMessageContents: '답변으로 추천하는 표현입니다.\
                                1. 일상적인 하루\
                                "I had a pretty normal day today."\
                                "Today was just another typical day."\
                                바쁜 하루\
                                "I had a really busy day today."\
                                "My day was jam-packed with activities."\
                                스트레스 받은 하루\
                                "Today was quite stressful."\
                                "I had a tough day today."\
                                즐거운 하루\
                                "I had a wonderful day."\
                                "Today was really enjoyable."\
                                생산적인 하루\
                                "I had a very productive day."\
                                "Today was very fruitful."\
                                느긋한 하루\
                                "I had a relaxing day."\
                                "Today was very laid-back."\
                                '
        }

    ];

    const ChatCard = styled.div`
        width: 450px;
        height: 600px;
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

    const ChatMessageWrapper = styled.div`
        display: flex;
        flex-direction: column;
        align-items: ${props => props.type === 'me' ? 'flex-end' : 'flex-start'};
        margin-bottom: ${props => (props.isDifferentType ? 'none' : '30px')};
    `;
    const AiMessageWrapper = styled.div`
        flex-direction: column;
        margin-bottom: 30px;
        align-items: flex-start;
        display: flex;
    `;

    return (
        <ChatCard>
            {data && data?.map((message, index) => {
                const isDifferentType = index > 0 && data[index - 1].type !== message.type;

                return (
                    <React.Fragment key={index}>
                        {(message.type === 'partner' || message.type === 'me') && (
                            <ChatMessageWrapper key={index} type={message.type} isDifferentType={isDifferentType}>
                                <ChatMessage
                                    type={message?.type}
                                    isOriginal={true}
                                >
                                    {message?.originalMessage}
                                </ChatMessage>
                                <ChatMessage
                                    type={message?.type}
                                    isOriginal={false}
                                >
                                    {message?.traslatedMessage.split('.').map((sentence, i) => (
                                        <span key={i}>{sentence.trim()}<br /></span>
                                    ))}
                                </ChatMessage>
                            </ChatMessageWrapper>
                        )}
                        {message.type === 'ai' && (
                            <AiMessageWrapper>
                                <ChatMessage
                                    type={message?.type}
                                    aiMessageType={message?.aiMessageType}
                                >
                                    {message?.aiMessageContents.split('.').map((sentence, i) => (
                                        <span key={i}>{sentence.trim()}<br /></span>
                                    ))}
                                </ChatMessage>
                            </AiMessageWrapper>
                        )}
                    </React.Fragment>
                )
            })}
        </ChatCard>
    )
};

export default ChatForm;