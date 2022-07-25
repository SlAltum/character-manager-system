import React, {useState, useEffect, useRef, useCallback} from 'react'
import './CardDetails.css'
import axio from 'axios'
import {useNavigate,Route,useParams} from 'react-router-dom'
import * as echarts from 'echarts';

function CardDetails(props) {
    const parmas=useParams()
    const navigate = useNavigate()
    const [data,setData] = useState({})
    const [scarList,setScarList] = useState([])
    const [skillList,setSkillList] = useState([])
    const [belongingList,setBelongingList] = useState([])
    const [relationList,setRelationList] = useState([])
    useEffect(()=>{
        console.log(parmas)
        fetchCard(parmas.id)
    },[parmas])
    useEffect(()=>{
        let myCharts = echarts.init(document.getElementById('details-radar-component'))
        myCharts.setOption(getOption(data))
    },[data])
    // 能力雷达图
    const getOption = (item) => {
        return {
            backgroundColor: "rgba(3,29,51,1)",
            tooltip: {},
          
            radar: {
                radius: "70%", //大小
                nameGap: 1, // 图中工艺等字距离图的距离
                center: ["50%", "50%"], // 图的位置
                name: {
                    textStyle: {
                        color: "rgba(101, 213, 255, 1)",
                        fontSize: 14,
                    },
                    formatter: function (name) {
                        return name;
                    },
                },
                indicator: [
                    { name: "外交", max: "100" },
                    { name: "军事", max: "100" },
                    { name: "密谋", max: "100" },
                    { name: "管理", max: "100" },
                    { name: "学识", max: "100" },
                ],
                axisLine: {
                    lineStyle: {
                        color: "rgba(153, 209, 246, 0.2)",
                    },
                },
                splitArea: {
                    show: false,
                    areaStyle: {
                        color: "rgba(255,0,0,0)", // 图表背景的颜色
                    },
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        width: 1,
                        color: "rgba(153, 209, 246, 0.2)", // 设置网格的颜色
                    },
                },
            },
          
            series: [
                {
                    name: "五维属性",
                    type: "radar",
                    symbol: "angle",
                    itemStyle: {
                        normal: {
                            areaStyle: { type: "default" },
                        },
                    },
                    data: [{
                        symbol: "circle",
                        symbolSize: 5,
                        value: [item.diplomacy, item.military, item.intrigue, item.stewardship, item.knowledge],
                        areaStyle: { color: "rgba(64, 205, 241, 0.2)" },
                        itemStyle: {
                            normal: {
                                borderWidth: 1,
                                color: "RGBA(0, 34, 66, 1)",
                                borderColor: "rgba(146, 225, 255, 1)",
                            },
                        },
                        lineStyle: {
                        color: "rgba(146, 225, 255, 1)",
                        width: 1,
                        },
                    }],
                },
            ],
        }
    }

    const fetchCard = async (id)=>{
        const res = await axio.get(`http://localhost:5000/get/${id}`)
        console.log('res',res.data.data._fields[0].properties)
        const getData = res.data.data._fields[0].properties
        const getScars = res.data.scarList
        const getRelations = res.data.relationList
        const getSkills = res.data.skillList
        const getBelongings = res.data.belongingList
        // console.log(getScars)
        // console.log('getData',getData)
        await setData({
            name:getData.name,
            age:getData.age,
            race:getData.race,
            nation:getData.nation,
            belief:getData.belief,
            job:getData.job,
            gender:getData.gender,
            temperament:getData.temperament,
            characteristic:getData.characteristic,
            diplomacy:getData.diplomacy.low,
            military:getData.military.low,
            intrigue:getData.intrigue.low,
            stewardship:getData.stewardship.low,
            knowledge:getData.knowledge.low,
            height:getData.height,
            figure:getData.figure,
            charm:getData.charm.low,
            wealth:getData.wealth,
            strength:getData.strength.low,
            agility:getData.agility.low,
            intelligence:getData.intelligence.low,
            physique:getData.physique.low,
            will:getData.will.low
        })
        // getScars.forEach(element => {
        //     scarList.push(element)
        // })
        // console.log('data=',data)
        setScarList(getScars)
        // console.log('scarList=',scarList)
        setRelationList(getRelations)
        // console.log('relationList=',relationList)
        setSkillList(getSkills)
        // console.log('skillList=',skillList)
        setBelongingList(getBelongings)
        // console.log('belongingList=',belongingList)
    }
    // 战斗能力
    useEffect(()=>{
        let myCharts = echarts.init(document.getElementById('details-combat-radar-component'))
        myCharts.setOption(getCombatOption(data))
    },[data])
    const getCombatOption = (item) => {
        return {
            backgroundColor: "rgba(3,29,51,1)",
            tooltip: {},
          
            radar: {
                radius: "70%", //大小
                nameGap: 1, // 图中工艺等字距离图的距离
                center: ["50%", "50%"], // 图的位置
                name: {
                    textStyle: {
                        color: "rgba(101, 213, 255, 1)",
                        fontSize: 14,
                    },
                    formatter: function (name) {
                        return name;
                    },
                },
                indicator: [
                    { name: "力量", max: "100" },
                    { name: "敏捷", max: "100" },
                    { name: "智力", max: "100" },
                    { name: "体质", max: "100" },
                    { name: "意志", max: "100" },
                ],
                axisLine: {
                    lineStyle: {
                        color: "rgba(153, 209, 246, 0.2)",
                    },
                },
                splitArea: {
                    show: false,
                    areaStyle: {
                        color: "rgba(255,0,0,0)", // 图表背景的颜色
                    },
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        width: 1,
                        color: "rgba(153, 209, 246, 0.2)", // 设置网格的颜色
                    },
                },
            },
          
            series: [
                {
                    name: "战斗能力",
                    type: "radar",
                    symbol: "angle",
                    itemStyle: {
                        normal: {
                            areaStyle: { type: "default" },
                        },
                    },
                    data: [{
                        symbol: "circle",
                        symbolSize: 5,
                        value: [item.strength, item.agility, item.intelligence, item.physique, item.will],
                        areaStyle: { color: "rgba(64, 205, 241, 0.2)" },
                        itemStyle: {
                            normal: {
                                borderWidth: 1,
                                color: "RGBA(0, 34, 66, 1)",
                                borderColor: "rgba(146, 225, 255, 1)",
                            },
                        },
                        lineStyle: {
                        color: "rgba(146, 225, 255, 1)",
                        width: 1,
                        },
                    }],
                },
            ],
        }
    }
    const handleDelete = async(e)=>{
        const confirmed = window.confirm('删除人物之后将不可恢复，确定要删除吗？');
        if (!confirmed) {
            return 
        } else {
            const res = await axio.delete(`http://localhost:5000/delete/${parmas.id}`)
            console.log(res)
            alert(res.data.message)
            navigate(-1)
        }
    }
    // 疤痕
    const scarsInfo = scarList.map((item,index)=>{
        return(
            <tr key={index}>
                <td>{item.bodyPart}</td>
                <td>{item.scarType}</td>
                <td>{item.scarShape}</td>
            </tr>
        )
    })
    // 技能
    const skillsInfo = skillList.map((item,index)=>{
        return(
            <tr key={index}>
                <td>{item.name}</td>
                <td>{item.type}</td>
                <td>{item.proficiency}</td>
            </tr>
        )
    })
    // 物品
    const belongingsInfo = belongingList.map((item,index)=>{
        return(
            <tr key={index}>
                <td>{item.name}</td>
                <td>{item.type}</td>
                <td>{item.state}</td>
            </tr>
        )
    })
    // 关系
    const relationInfo = relationList.map((item,index)=>{
        let classGender = 'gender-others'
        if(item.details.gender === '男')classGender = 'gender-male'
            else if(item.details.gender === '女')classGender = 'gender-female'
        return(
            <tr key={index}>
                <td>{item.relation.type}</td>
                <td>{item.relation.relationship}</td>
                <td>
                <div className={`card ${classGender}`} key={index} onClick={()=>{navigate(`/cards/${item.details.id}`)}}>
                    <table>
                    <tbody>
                        <tr>
                        <td>姓名:{item.details.name}</td>
                        <td>种族:{item.details.race}</td>
                        </tr>
                        <tr>
                        <td>性别:{item.details.gender}</td>
                        <td>民族:{item.details.nation}</td>
                        </tr>
                        <tr>
                        <td>年龄:{item.details.age}</td>
                        <td>信仰:{item.details.belief}</td>
                        </tr>
                        <tr>
                        <td>职业:{item.details.job}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                </td>
            </tr>
        )
    })

    return (
        <div id='card-detail-container'>
            <div id='top-bars'>
                <a className='goback' onClick={()=>{navigate(-1)}}>返回</a>
                <a className='revise' onClick={()=>{navigate(`/revise/${parmas.id}`)}}>修改</a>
                <a className='revise' onClick={handleDelete}>删除</a>
            </div>
            <div id='card-details-content'>
                <div className='details-row'>
                    <div className='details-module' id='details-ability-info'>
                        <div id='details-radar-component' />
                    </div>
                    <div className='details-module' id='details-basic-info'>
                        <table>
                            <tbody>
                                <tr>
                                    <td>姓名:{data.name}</td>
                                    <td>种族:{data.gender}</td>
                                </tr>
                                <tr>
                                    <td>性别:{data.gender}</td>
                                    <td>民族:{data.nation}</td>
                                </tr>
                                <tr>
                                    <td>年龄:{data.age}</td>
                                    <td>信仰:{data.belief}</td>
                                </tr>
                                <tr>
                                    <td>职业:{data.job}</td>
                                </tr>
                                <tr><td></td></tr>
                                <tr>
                                    <td>气质:{data.temperament}</td>
                                    <td>性格:{data.characteristic}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='details-module' id='details-combat-info'>
                        <div id='details-combat-radar-component' />
                    </div>
                    <div className='details-module' id='details-scars-info'>
                        <table>
                            <tbody>
                                <tr>
                                    <td>身高:{data.height}cm</td>
                                    <td>体型:{data.figure}</td>
                                    <td>魅力:{data.charm}/100</td>
                                </tr>
                            </tbody>
                        </table>
                        <table>
                            <tbody>
                                <tr>
                                    <th>部位</th>
                                    <th>类型</th>
                                    <th>外形</th>
                                </tr>
                                {scarsInfo}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='details-row'>
                    <div className='details-module' id='details-skills'>
                        <table>
                            <tbody>
                                <tr>
                                    <th>技能名称</th>
                                    <th>技能类型</th>
                                    <th>熟练度</th>
                                </tr>
                                {skillsInfo}
                            </tbody>
                        </table>
                    </div>
                    <div className='details-module' id='details-belongings'>
                        <table>
                            <tbody>
                                <tr>
                                    <th>物品名称</th>
                                    <th>物品种类</th>
                                    <th>保存状态</th>
                                </tr>
                                {belongingsInfo}
                            </tbody>
                        </table>
                    </div>
                    <div className='details-module' id='details-relations'>
                        <table>
                            <tbody>
                                <tr>
                                    <th>关系类型</th>
                                    <th>关系</th>
                                    <th>人物</th>
                                </tr>
                                {relationInfo}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardDetails