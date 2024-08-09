import React from 'react'
import styled from 'styled-components'

const LanguageContainer = styled.div`
  margin-left : 2px;
  display: flex;
  align-items: center;
  font-family: Arial, sans-serif;
`;

const Language = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right : 6px;
`;

const LanguageName = styled.span`
  font-weight : 500;
  font-size : 12px;
`;

const Gauge = styled.div`
  width: 40px;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 2px;
`;

const GaugeFill = styled.div`
  height: 100%;
  border-radius: 5px;
`;

const Arrow = styled.span`
  font-weight : 50;
  font-size: 18px;
  margin-right : 4px;
  margin-left : 4px;
`;

export default props => {
  const { nativeLanguage, learningLanguages  } = props;

  const getGaugeWidth = (level) => {
    return (level / 6) * 100 + '%';
  };
  if(!nativeLanguage && !learningLanguages) {
    return null
  }
  return (
    <LanguageContainer>
      {nativeLanguage && (
        <>
        <Language style={{marginRight : '0px'}}>
        <LanguageName>{nativeLanguage}</LanguageName>
        <Gauge>
          <GaugeFill style={{ width: '100%', backgroundColor: '#4caf50' }} />
        </Gauge>
      </Language>
      <Arrow>&gt;</Arrow>
      </>
      )}

      <div style={{display : 'flex', flexWrap : 'wrap'}}>
      {learningLanguages?.map((lang, index) => (
        <Language key={index}>
          <LanguageName>{lang.language}</LanguageName>
          <Gauge>
            <GaugeFill
              style={{
                width: getGaugeWidth(lang.langLevel),
                backgroundColor: '#2196f3'
              }}
            />
          </Gauge>
        </Language>
      ))}
      </div>
    </LanguageContainer>
  );
};
