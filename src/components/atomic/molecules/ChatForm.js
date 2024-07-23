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
    `;

    const ChatMessageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: ${props => props.type === 'me' ? 'flex-end' : 'flex-start'};
    margin-bottom: ${props => (props.isDifferentType ? 'none' : '30px')};
    `;

    return (
        <ChatCard>
            {data && data?.map((message, index) => {
                const isDifferentType = index > 0 && data[index - 1].type !== message.type;
                return (
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
                )
            })}
        </ChatCard>
    )
};

export default ChatForm;