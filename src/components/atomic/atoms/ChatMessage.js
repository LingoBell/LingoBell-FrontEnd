import React from "react";
import { ORIGINAL_MESSAGE, ORIGINAL_PARTNER_MESSAGE, TRANSLATED_MESSAGE, TRANSLATED_PARTNER_MESSAGE } from "./Color";
import styled from "styled-components";

const CHAT_MESSAGE_STYLE = {
    'me-original': `
        background-color: ${ORIGINAL_MESSAGE};
        border: 2px solid #000;
        color: black;
    `,
    'me-translated': `
        background-color: ${TRANSLATED_MESSAGE};
        color: black;
    `,
    'partner-original': `
        background-color: ${ORIGINAL_PARTNER_MESSAGE};
        color: white;
    `,
    'partner-translated':`
        background-color: ${TRANSLATED_PARTNER_MESSAGE};
        color: white;
    `
}
export const ChatMessage = styled.div`
    display: block;
    padding: 15px 12px;
    border-radius: 8px;
    ${props => {
        if (props.type === 'me' && props.isOriginal) {
            return CHAT_MESSAGE_STYLE['me-original']

        } else if (props.type === 'me') {
            return CHAT_MESSAGE_STYLE['me-translated']

        } else if (props.type === 'partner' && props.isOriginal) {
            return CHAT_MESSAGE_STYLE['partner-original']

        } else {
            return CHAT_MESSAGE_STYLE['partner-translated']
        }
    }}
    `;

    