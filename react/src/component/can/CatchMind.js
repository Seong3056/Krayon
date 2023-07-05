import React from 'react'
import PaintZone from './PaintZone'
import UserInfo from '../main/UserInfo'
import Chatting from '../main/Chatting'
import UserList from '../main/UserList'
import "../../resource/scss/game/can/can.scss"

const CatchMind = () => {
  return (
    <>
    <div className='view'>
        <div class="sectionMypage">
            <PaintZone/>
        
        </div>
        <div class="can-bottom">
            <Chatting className = "chat"/>
        </div>
        
    </div>
        <div className="sectionUserList">
            <UserInfo className = "userInfo"/>
            <UserList className = "userList"/>
        </div>
        
    </>
  )
}

export default CatchMind