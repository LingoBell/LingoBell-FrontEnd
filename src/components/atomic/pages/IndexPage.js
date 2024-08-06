import React, { useEffect } from 'react'
import styled from 'styled-components'
import Button from '../atoms/Button'
import { Title, Paragraph } from '../atoms/Typograpy'
import { useSelector, useDispatch } from 'react-redux';
import { auth, googleProvider } from '../../../firebase/firebase';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { clearUser, setUser, signInWithGoogle } from '../../../redux/userSlice';
import { PRIMARY_COLOR } from '../../../consts/color';



const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-left: 16px;
  padding-right: 16px;
  @media screen and (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
  @media screen and (min-width: 1100px) {
    max-width: 1024px;
    margin-left: auto;
    margin-right: auto;
  }
`

const ImageWrap = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  > img {
    max-width: 350px;
  }
  @media screen and (min-width: 768px) {
    order: 2;
    
    > img {
      max-width: none;
    }
  }
  @media screen and (min-width: 1100px) {
    justify-content: flex-end;
  }
`

const ContentFullWrap = styled.div`
  @media screen and (min-width: 768px) {
    order: 1;
    max-width: 400px;
  }
`

const ContentWrap = styled.div`
  
  line-height: 1.4;
`

const StyledTitle = styled(Title)`
  font-size: 28px;
`

const StyledParagraph = styled(Paragraph)`
  font-size: 28px;
`


const ButtonWrap = styled.div`
  padding-bottom: 24px;
  padding-top: 48px;
`
const StyledButton = styled(Button)`
  height: 40px;
  width: 100%;
  font-size: 16px;
  border : 1px solid ${PRIMARY_COLOR};
`
const StyledLogin = styled.div`
  color : ${PRIMARY_COLOR};
  font-weight : 500;

`
const GoogleWrap = styled.div`
  display : flex;
  justify-content : center;
  align-items : center;
  position : relative;
  bottom : 7px;
  `
// export default props => {
//   return (
//     <Container>
//       <ImageWrap>
//         <img width='80%' src='/indexImage.png' />
//       </ImageWrap>
//       <ContentFullWrap>
//         <ContentWrap>
//           <StyledTitle>Welcome to LingoBell</StyledTitle>
//           <StyledParagraph>Your AI assistant for language exchange</StyledParagraph>
//         </ContentWrap>
//         <ButtonWrap>
//           <StyledButton $type='bordered'>구글 계정으로 로그인</StyledButton>
//           <StyledButton $type='black'>이메일로 로그인하기</StyledButton>
//           <StyledButton>회원 가입</StyledButton>
//         </ButtonWrap>
//       </ContentFullWrap>

//     </Container>
//   )
// }

const IndexPage = (props) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => {
    console.log('state : ')
    console.log(state)
    return state.user?.user
  })
  const trySigninWithGoogle = () => {
    dispatch(signInWithGoogle())
  }
  // const signInWithGoogle = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, googleProvider);
  //     console.log('result : ')
  //     console.log(result)
  //     const idToken = await result.user.getIdToken(); // ID 토큰 가져옴
  //     console.log(idToken)
  //     const verificationResult = await axios.post('http://127.0.0.1:8000/verify-token', { idToken }); //토큰을 서버로 전송
  //     if (verificationResult) {
  //       dispatch(setUser(result.user));
  //     }
  //   } catch (error) {
  //     console.error("Error signing in with Google", error);
  //   }
  // };

  return (
    <Container>
      <ImageWrap>
        <img width='80%' src='https://storage.googleapis.com/lingobellstorage/indexImage.png' alt="Welcome" />
      </ImageWrap>
      <ContentFullWrap>
        <ContentWrap>
          <StyledTitle>Welcome to LingoBell</StyledTitle>
          <StyledParagraph>Your AI assistant for language exchange</StyledParagraph>
        </ContentWrap>
        <ButtonWrap>
          <StyledButton $type='bordered' onClick={trySigninWithGoogle}>
            <GoogleWrap>
              <img width='30px' src='https://storage.googleapis.com/lingobellstorage/googleLogo.png'
              style={{paddingRight : '6px'}} />
              <StyledLogin>Sign in with Google</StyledLogin>
            </GoogleWrap>
          </StyledButton>
        </ButtonWrap>
      </ContentFullWrap>
    </Container>
  );
};

export default IndexPage;
