import React from "react";
import { ORIGINAL_PARTNER_MESSAGE } from "./Color";
import { oneOf } from "prop-types";
import styled from "styled-components";

export const ChatMessage = styled.div`
    display: block;
    padding: 15px 12px;
    background-color: ${props => {
        if (props.type === 'me') {
            return props.isOriginal ? 'white' : '#d5d5d5';
        } else {
            return props.isOriginal ? '#283593' : '#007AFF';
        }
    }};
    border: ${props => (props.type === 'me' && props.isOriginal) ? '2px solid #000000' : 'none'};
    color: ${ props => props.type === 'me' ? 'black' : 'white' };
    border-radius: 8px;
    `;