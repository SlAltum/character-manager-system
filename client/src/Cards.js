import React, {useState, useEffect, useRef, useCallback} from 'react'
import './Cards.css'
import axio from 'axios'
import {useNavigate,Route} from 'react-router-dom'
import { Input, Space } from 'antd'

function Cards() {
  const navigate = useNavigate()
  const [cardList,setCardList] = useState([])

  useEffect(()=>{
    console.log('渲染完成')
    fetchCards()
  },[])

  const fetchCards = async ()=>{
    let newCardList = []
    const res = await axio.get('http://localhost:5000/get')
    console.log('res',res.data)
    res.data.forEach(element => {
      newCardList.push(element._fields[0].properties)
      console.log(element)
    });
    setCardList(newCardList)
    console.log(cardList)
  }

  // 列表渲染卡片
  let cards = cardList.map((item,index)=>{
    console.log(item)
    let classGender = 'gender-others'
    if(item.gender === '男')classGender = 'gender-male'
      else if(item.gender === '女')classGender = 'gender-female'
    
    return(
      <div className={`card ${classGender}`} key={index} onClick={()=>{navigate(`/cards/${item.id}`)}}>
        <table>
          <tbody>
            <tr>
              <td>姓名:{item.name}</td>
              <td>种族:{item.race}</td>
            </tr>
            <tr>
              <td>性别:{item.gender}</td>
              <td>民族:{item.nation}</td>
            </tr>
            <tr>
              <td>年龄:{item.age}</td>
              <td>信仰:{item.belief}</td>
            </tr>
            <tr>
              <td>职业:{item.job}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  })

  const { Search } = Input
  const onSearch = async (value) => {
    console.log(value)
    const res = await axio.get(`http://localhost:5000/query?key=${value}`)
    console.log(res.data)
    setCardList(res.data)
  }

  return (
    <div id='cards-father'>
      <Search
        placeholder="请输入人物姓名(可以少输但不能输错)"
        onSearch={onSearch}
        style={{
          width: '100%',
        }}
      />
      <div id='cards-container'>
          {cards}
      </div>
    </div>
  )
}

export default Cards