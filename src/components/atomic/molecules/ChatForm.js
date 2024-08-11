import React, { forwardRef, useState } from "react";
import styled from "styled-components";
import { ChatMessage } from "../atoms/ChatMessage";
import { ORIGINAL_PARTNER_MESSAGE } from "../atoms/Color";
import ChatCard from "../templates/ChatSectionCard";
import { useSelector } from "react-redux";
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

function ChatForm(props, ref) {
    const { data, className, id } = props

    const { user } = useSelector((state) => {
        return { user: state.user?.user}
    })


    return (
        <StyledChatCard className={className} ref={ref}>
            {data && data?.map((message, index) => {
                const isDifferentType = index > 0 && data[index - 1].type !== message.type;
                
                let messageType;
                if (message.type === 'ai' || message.type === 'quiz') {
                    messageType = message.type;
                } else {
                    messageType = message.messageSenderId === user.uid ? 'me' : 'partner';
                } 
                
                return (
                    <React.Fragment key={index}>
                        {(messageType === 'partner' || messageType === 'me') && (
                            <ChatMessageWrapper key={index} type={messageType} isDifferentType={isDifferentType}>
                                <ChatMessage
                                    type={messageType}
                                    isOriginal={true}
                                >
                                    {message?.originalMessage}
                                </ChatMessage>
                                {message?.translatedMessage && (
                                    <ChatMessage
                                    type={messageType}
                                    isOriginal={false}
                                >
                                    {message?.translatedMessage}
                                </ChatMessage>
                                )}
                            </ChatMessageWrapper>
                        )}
                        {messageType === 'ai' && (
                            <AiMessageWrapper>
                                <ChatMessage
                                    type={message?.type}
                                >
                                    <pre style={{ whiteSpace: 'pre-wrap' }}>{message?.aiRecommendation?.trim()}</pre>
                                </ChatMessage>
                            </AiMessageWrapper>
                        )}
                    </React.Fragment>
                )
            })}
            {props.children}
        </StyledChatCard>
    )
};

export default forwardRef(ChatForm);