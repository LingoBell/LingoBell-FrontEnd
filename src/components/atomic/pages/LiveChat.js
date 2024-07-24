import React from "react";
import ChatForm from "../molecules/ChatForm";
import styled from "styled-components";

function LiveChat() {

    const LiveChat = styled.div`
        display: flex;
        padding: 15px;
    `;

    return (
        <LiveChat>
            <ChatForm>
                AI
            </ChatForm>
            <ChatForm>
                영통
            </ChatForm>
            <ChatForm>
                SCRIPT
            </ChatForm>
        </LiveChat>
    );
};

export default LiveChat;