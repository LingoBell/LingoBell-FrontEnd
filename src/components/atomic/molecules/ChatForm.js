import React, { forwardRef, useState } from "react";
import styled from "styled-components";
import { ChatMessage } from "../atoms/ChatMessage";
import { ORIGINAL_PARTNER_MESSAGE } from "../atoms/Color";
import ChatCard from "../templates/ChatSectionCard";
import { useSelector } from "react-redux";

const StyledChatCard = styled(ChatCard)`
    background-color: white;
    border: 2px solid #283593;
    overflow-y: auto;
    padding: 10px;
    border-radius: 8px;
    
    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #888;
        border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: #555;
    }

    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    -ms-overflow-style: auto;
    scrollbar-width: thin;
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
    const { data, className, id, lastMessageRef } = props

    const { user } = useSelector((state) => {
        return { user: state.user?.user}
    })

    return (
        <StyledChatCard id={id} className={className} ref={ref}>
            {data && data?.map((message, index) => {
                const isDifferentType = index > 0 && data[index - 1].type !== message.type;

                if (message.type !== 'ai') {
                    if (message.messageSenderId === user.uid) {
                        message = {
                            ...message, 
                            type: 'me'
                        };
                    } else {
                        message = {
                            ...message, 
                            type: 'partner'
                        };
                    }
                }

                const isLastMessage = index === data.length - 1; // 마지막 메시지인지 확인

                return (
                    <React.Fragment key={index}>
                        {(message.type === 'me' || message.type === 'partner') && (
                            <ChatMessageWrapper key={index} type={message.type} isDifferentType={isDifferentType} ref={isLastMessage ? lastMessageRef : null}>
                                <ChatMessage
                                    type={message.type}
                                    isOriginal={true}
                                >
                                    {message.originalMessage}
                                </ChatMessage>
                                {message?.translatedMessage && (
                                    <ChatMessage
                                    type={message.type}
                                    isOriginal={false}
                                >
                                    {message.translatedMessage}
                                </ChatMessage>
                                )}
                            </ChatMessageWrapper>
                        )}
                        {message.type === 'ai' && (
                            <AiMessageWrapper>
                                <ChatMessage
                                    type={message.type}
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