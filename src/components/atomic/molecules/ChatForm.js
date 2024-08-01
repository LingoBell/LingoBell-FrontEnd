import React from "react";
import styled from "styled-components";
import { ChatMessage } from "../atoms/ChatMessage";
import { ORIGINAL_PARTNER_MESSAGE } from "../atoms/Color";
import ChatCard from "../templates/ChatSectionCard";
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

function ChatForm(props) {
    const { data, className } = props

    return (
        <StyledChatCard className={className}>
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
                                    {message?.traslatedMessage}
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
        </StyledChatCard>
    )
};

export default ChatForm;