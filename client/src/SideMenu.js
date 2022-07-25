import React from 'react'
import './SideMenu.css'
import {useNavigate,Route} from 'react-router-dom'

function SideMenu() {
  const navigate = useNavigate()
  return(
    <div className='container-sm'>
        <nav>
            <ul>
                <li onClick={()=>{navigate('/new')}}>创建人物</li>
                <li onClick={()=>{navigate('/cards')}}>人物管理</li>
            </ul>
        </nav>
    </div>
  )
}

export default SideMenu