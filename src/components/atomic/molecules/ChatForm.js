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
                
                return (
                    <React.Fragment key={index}>
                        {(message.type === 'me' || message.type === 'partner') && (
                            <ChatMessageWrapper key={index} type={message.type} isDifferentType={isDifferentType}>
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