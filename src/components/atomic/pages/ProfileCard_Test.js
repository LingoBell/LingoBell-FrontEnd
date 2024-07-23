import React from 'react'
import styled from 'styled-components'
import ProfileItem from '../molecules/ProfileItem'
import { Tag } from '../atoms/BaseImage'

const Interests = styled(Tag)`
color : white;
background-color : rgba(73,69,70,1);
margin-right : 8px;
font-size : 14px;
padding : 8px;
`


const data = {
        title : "UserName",
        content : "my user content",
        tags:["Language Learner", "Korean-English"],
        interests : ["Travel", "Movie", "Sports", "Food"]      
    }



export default props => {
    return (
        <>
         <ProfileItem title={data.title}
            content={data.content} tags={data.tags}/>

        <ProfileItem title={data.title}
            content={data.content} tags={data.tags}>
            <div style={{display : "flex"}}>
            {data.interests.map(item => {
                return(
                    <Interests>{item}</Interests>
                )
            })}
            </div>
        </ProfileItem>
        </>
    )
}