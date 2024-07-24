import React from 'react'
import styled from 'styled-components'
const ChatCard = styled.div`

  background-color: white;
  border: 2px solid #283593;
  overflow-y: auto;
  border-radius: 8px;
  ::-webkit-scrollbar {
      width: 0px;
      background: transparent; /* make scrollbar transparent */
  }
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
`;
export default ChatCard