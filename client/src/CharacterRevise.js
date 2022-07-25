import React, {useState, useEffect, useRef, useCallback} from 'react'
import './CharacterForm.css'
import personalityDimension from './personality-dimension.jpeg'
import ReactEcharts from "echarts-for-react";
import * as echarts from 'echarts';
import { Input, InputNumber, Slider } from 'antd';
import axio from 'axios'
import {useNavigate,Route,useParams} from 'react-router-dom'

function CharacterRevise() {
    const navigate = useNavigate()
    const parmas=useParams()
    const fetchCard = async (id)=>{
        const res = await axio.get(`http://localhost:5000/get/${id}`)
        console.log('res',res.data.data._fields[0].properties)
        const getData = res.data.data._fields[0].properties
        const getScars = res.data.scarList
        // const getRelations = res.data.relationList
        const getSkills = res.data.skillList
        const getBelongings = res.data.belongingList
        let getRelations = []
        res.data.relationList.forEach((item,index) => {
            const newRelation = {
                id:item.details.id,
                name:item.details.name,
                relationType:item.relation.type,
                relationship:item.relation.relationship
            }
            getRelations.push(newRelation)
        });
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
    useEffect(()=>{
        console.log(parmas)
        fetchCard(parmas.id)
        if(data.gender != '男' && data.gender != '女')
            setShowElemOtherGender('inline')
    },[parmas])
    const persionality = [
        {
            temperament:'胆汁质',
            characteristic:['主动','乐观','冲动','善变','激动','好斗','不安','易怒']
        },
        {
            temperament:'抑郁质',
            characteristic:['忧郁','焦虑','固执','淡漠','悲观','保守','腼腆','文静']
        },
        {
            temperament:'粘液质',
            characteristic:['被动','谨慎','细心','平和','克制','可靠','平稳','镇静']
        },
        {
            temperament:'多血质',
            characteristic:['领导','无虑','活泼','悠闲','机灵','健谈','开朗','活跃']
        }
    ]

    const [data,setData] = useState(
        {
            name:'',
            age:'',
            race:'',
            nation:'',
            belief:'',
            job:'',
            gender:'',
            temperament:persionality[0].temperament,
            characteristic:persionality[0].characteristic[0],
            diplomacy:50,
            military:50,
            intrigue:50,
            stewardship:50,
            knowledge:50,
            height:'',
            figure:'',
            charm:50,
            wealth:'',
            strength:50,
            agility:50,
            intelligence:50,
            physique:50,
            will:50
        }
    )

    const [showElemOtherGender,setShowElemOtherGender] = useState('none')
    // 疤痕和胎记
    const [scarList,setScarList] = useState([])
    const [bodyPart,setBodyPart] = useState('部位')
    const [scarType,setScarType] = useState('类型')
    const [scarShape,setScarShape] = useState('外观')

    const handleSubmit = async (e)=>{
        e.preventDefault();
        console.log(data)
        const res = await axio.post(`http://localhost:5000/revise/${parmas.id}`,{
            data:data,scarList:scarList,
            relationList:relationList,
            skillList:skillList,
            belongingList:belongingList
        })
        console.log(res)
        if(res.data.message === '成功创建人物'){
            alert('修改成功')
            navigate(`/cards/${res.data.id}`)
        }else if(res.data.message === '该人物不存在')alert('人物不存在')
    }
    // 姓名
    const handleChangeName = (e) => {
        // console.log(data)
        let newData = Object.assign({...data},{name:e.target.value})
        // console.log(data)
        setData(newData)
        // console.log(data)
    }
    // 年龄
    const handleChangeAge = (e) => {
        let newData = Object.assign({...data},{age:e.target.value})
        setData(newData)
    }
    // 种族
    const handleChangeRace = (e) => {
        let newData = Object.assign({...data},{race:e.target.value})
        setData(newData)
    }
    // 民族
    const handleChangeNation = (e) => {
        let newData = Object.assign({...data},{nation:e.target.value})
        setData(newData)
    }
    // 信仰
    const handleChangeBelief = (e) => {
        let newData = Object.assign({...data},{belief:e.target.value})
        setData(newData)
    }
    // 职业
    const handleChangeJob = (e) => {
        let newData = Object.assign({...data},{job:e.target.value})
        setData(newData)
    }
    // 性别
    const handleChangeGender = (e) => {
        let newData = Object.assign({...data},{gender:e.target.value})
        setData(newData)
        if(e.target.value === '请输入'){
            setShowElemOtherGender('inline')
        }else if(e.target.value === '男' || e.target.value === '女'){
            setShowElemOtherGender('none')
        }
    }
    // 气质
    const handleChangeTemperament = (e) => {
        // console.log(data.temperament)
        let newData = Object.assign({...data},{temperament:e.target.value})
        persionality.map((item, index) => {
          if(e.target.value === item.temperament) {
            newData = Object.assign(newData,{characteristic:item.characteristic[0]})
            setData(newData)
          }
          return true;
        })
        // 映射坐标系
        let myCharts = echarts.init(document.getElementById('persionality-dimension'))
        let x=0,y=0
        switch(newData.temperament){
            case '胆汁质':
                switch(newData.characteristic){
                    case '主动':x=39;y=7;break;
                    case '乐观':x=37;y=14;break;
                    case '冲动':x=35;y=20;break;
                    case '善变':x=31;y=26;break;
                    case '激动':x=26;y=31;break;
                    case '好斗':x=20;y=35;break;
                    case '不安':x=14;y=37;break;
                    case '易怒':x=7;y=39;break;
                    default:
                }break;
            case '抑郁质':
                switch(newData.characteristic){
                    case '忧郁':x=-7;y=39;break;
                    case '焦虑':x=-14;y=37;break;
                    case '固执':x=-20;y=35;break;
                    case '淡漠':x=-26;y=31;break;
                    case '悲观':x=-31;y=26;break;
                    case '保守':x=-35;y=20;break;
                    case '腼腆':x=-37;y=14;break;
                    case '文静':x=-39;y=7;break;
                    default:
                }break;
            case '粘液质':
                switch(newData.characteristic){
                    case '被动':x=-39;y=-7;break;
                    case '谨慎':x=-37;y=-14;break;
                    case '细心':x=-35;y=-20;break;
                    case '平和':x=-31;y=-26;break;
                    case '克制':x=-26;y=-31;break;
                    case '保守':x=-20;y=-35;break;
                    case '腼腆':x=-14;y=-37;break;
                    case '文静':x=-7;y=-39;break;
                    default:
                }break;
            case '多血质':
                switch(newData.characteristic){
                    case '领导':x=7;y=-39;break;
                    case '无虑':x=14;y=-37;break;
                    case '活泼':x=20;y=-35;break;
                    case '悠闲':x=26;y=-31;break;
                    case '机灵':x=31;y=-26;break;
                    case '健谈':x=35;y=-20;break;
                    case '开朗':x=37;y=-14;break;
                    case '活泼':x=39;y=-7;break;
                    default:
                }break;
            default:
        }
        myCharts.setOption(getOptionCharacteristic(x,y))
    }
    // 特质
    const handleChangeCharacteristic = (e) => {
        let newData = Object.assign({...data},{characteristic:e.target.value})
        setData(newData)
        // 映射坐标系
        let myCharts = echarts.init(document.getElementById('persionality-dimension'))
        let x=0,y=0
        switch(newData.temperament){
            case '胆汁质':
                switch(newData.characteristic){
                    case '主动':x=39;y=7;break;
                    case '乐观':x=37;y=14;break;
                    case '冲动':x=35;y=20;break;
                    case '善变':x=31;y=26;break;
                    case '激动':x=26;y=31;break;
                    case '好斗':x=20;y=35;break;
                    case '不安':x=14;y=37;break;
                    case '易怒':x=7;y=39;break;
                    default:
                }break;
            case '抑郁质':
                switch(newData.characteristic){
                    case '忧郁':x=-7;y=39;break;
                    case '焦虑':x=-14;y=37;break;
                    case '固执':x=-20;y=35;break;
                    case '淡漠':x=-26;y=31;break;
                    case '悲观':x=-31;y=26;break;
                    case '保守':x=-35;y=20;break;
                    case '腼腆':x=-37;y=14;break;
                    case '文静':x=-39;y=7;break;
                    default:
                }break;
            case '粘液质':
                switch(newData.characteristic){
                    case '被动':x=-39;y=-7;break;
                    case '谨慎':x=-37;y=-14;break;
                    case '细心':x=-35;y=-20;break;
                    case '平和':x=-31;y=-26;break;
                    case '克制':x=-26;y=-31;break;
                    case '保守':x=-20;y=-35;break;
                    case '腼腆':x=-14;y=-37;break;
                    case '文静':x=-7;y=-39;break;
                    default:
                }break;
            case '多血质':
                switch(newData.characteristic){
                    case '领导':x=7;y=-39;break;
                    case '无虑':x=14;y=-37;break;
                    case '活泼':x=20;y=-35;break;
                    case '悠闲':x=26;y=-31;break;
                    case '机灵':x=31;y=-26;break;
                    case '健谈':x=35;y=-20;break;
                    case '开朗':x=37;y=-14;break;
                    case '活泼':x=39;y=-7;break;
                    default:
                }break;
            default:
        }
        myCharts.setOption(getOptionCharacteristic(x,y))
    }

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
    // 雷达图重渲染
    useEffect(() => {
        let myCharts = echarts.init(document.getElementById('radar-component'))
        myCharts.setOption(getOption(data))
        // console.log('updating...')
    },[])
    // 外交
    const onDiplomacyChange = (newValue) => {
        let newData = Object.assign({...data},{diplomacy:newValue})
        setData(newData)
        let myCharts = echarts.init(document.getElementById('radar-component'))
        myCharts.setOption(getOption(data))
    };
    // 军事
    const onMilitaryChange = (newValue) => {
        let newData = Object.assign({...data},{military:newValue})
        setData(newData)
        let myCharts = echarts.init(document.getElementById('radar-component'))
        myCharts.setOption(getOption(data))
    };
    // 密谋
    const onIntrigueChange = (newValue) => {
        let newData = Object.assign({...data},{intrigue:newValue})
        setData(newData)
        let myCharts = echarts.init(document.getElementById('radar-component'))
        myCharts.setOption(getOption(data))
    };
    // 管理
    const onStewardshipChange = (newValue) => {
        let newData = Object.assign({...data},{stewardship:newValue})
        setData(newData)
        let myCharts = echarts.init(document.getElementById('radar-component'))
        myCharts.setOption(getOption(data))
    };
    // 学识
    const onKnowledgeChange = (newValue) => {
        let newData = Object.assign({...data},{knowledge:newValue})
        setData(newData)
        let myCharts = echarts.init(document.getElementById('radar-component'))
        myCharts.setOption(getOption(data))
    };

    // 生成性格选项
    const temperament = persionality.map((item, index) => {
        return <option key={index} value={item.temperament}>{item.temperament}</option>
    })
    const characteristic = persionality.map((item, index) => {
        if(data.temperament === item.temperament) {
            return item.characteristic.map((item, index) =>
                <option key={index} value={item}>{item}</option>
            )
        }
        return true;
    })
    // 添加疤痕
    const addScar = ()=>{
        const newScar = {
            bodyPart:bodyPart,
            scarType:scarType,
            scarShape:scarShape
        }
        setScarList([...scarList,newScar])
    }
    // 删除疤痕
    const deleteScar = (e)=>{
        const index = e.target.getAttribute("data-index")
        const newList = [...scarList]
        newList.splice(index,1)
        setScarList(newList)
    }
    // 疤痕数据回显
    const onBodyPartChange = (e)=>{
        setBodyPart(e.target.value)
    }
    const onScarTypeChange = (e)=>{
        setScarType(e.target.value)
    }
    const onScarShapeChange = (e)=>{
        setScarShape(e.target.value)
    }
    // 身高
    const handleChangeHeight = (e) => {
        let newData = Object.assign({...data},{height:e.target.value})
        setData(newData)
    }
    // 体型
    const handleChangeFigure = (e) => {
        let newData = Object.assign({...data},{figure:e.target.value})
        setData(newData)
    }
    // 魅力
    const onCharmChange = (newValue) => {
        let newData = Object.assign({...data},{charm:newValue})
        setData(newData)
    }
    // 搜索人物
    const { Search } = Input
    const [characterList,setCharacterList] = useState([])
    const [newRelation,setNewRelation] = useState()
    const onSearch = useCallback(doResearch(), [])
    function doResearch() {
        let timer;
        console.log(newRelation)
        return function (e) {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(async () => {
                e.preventDefault()
                console.log(e.target.value)
                const key = e.target.value
                const res = await axio.get(`http://localhost:5000/query?key=${key}`)
                console.log(res.data)
                setCharacterList(res.data)
            }, 500);
        }
    }
    // async (e) => {
    //     e.preventDefault()
    //     console.log(e.target.value)
    //     // const res = await axio.get(`http://localhost:5000/query?key=${value}`)
    //     // console.log(res.data)
    //     // setCharacterList(res.data)
    // }
    let relatedCharacters = characterList.map((item,index)=>{
        if(item.id === parmas.id)return;
        let classGender = 'gender-others'
        if(item.gender === '男')classGender = 'gender-male'
          else if(item.gender === '女')classGender = 'gender-female'
        
        return(
          <div className={`card ${classGender}`}
            key={index}
            onClick={()=>{
                // console.log(item)
                setNewRelation({...item})
            }}
          >
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
    // const recentSelectedCharacter = <></>
    const getSelectedCharacter = ()=>{
        if(newRelation === undefined){
            return(
                <div className='unselseted-card'>
                    未选择
                </div>
            )
        }else{
            let classGender = 'gender-others'
            if(newRelation.gender === '男')classGender = 'gender-male'
            else if(newRelation.gender === '女')classGender = 'gender-female'
            return(
                <div className={`card ${classGender}`}>
                    <table>
                        <tbody>
                        <tr>
                            <td>姓名:{newRelation.name}</td>
                            <td>种族:{newRelation.race}</td>
                        </tr>
                        <tr>
                            <td>性别:{newRelation.gender}</td>
                            <td>民族:{newRelation.nation}</td>
                        </tr>
                        <tr>
                            <td>年龄:{newRelation.age}</td>
                            <td>信仰:{newRelation.belief}</td>
                        </tr>
                        <tr>
                            <td>职业:{newRelation.job}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
          )
        }
    }
    let recentSelectedCharacter = getSelectedCharacter()
    // 人物关系选项
    const relationOptionList = [
        {
            relationType:'原生家庭',
            relationship:['父亲','母亲','哥哥','弟弟','姐姐','妹妹','爷爷','奶奶','外公','外婆']
        },
        {
            relationType:'再生家庭',
            relationship:['丈夫','妻子','儿子','女儿','义父','义母','义兄','义弟','义姐','义妹']
        },
        {
            relationType:'社交网络',
            relationship:['恋人','朋友','同事','上司','下属','老师','同学','学生']
        },
        {
            relationType:'对手',
            relationship:['竞争对手','情敌','仇敌']
        }
    ]
    const [relationType,setRelationType] = useState(relationOptionList[0].relationType)
    const [relationship,setRelationShip] = useState(relationOptionList[0].relationship[0])
    const relationTypeOptions = relationOptionList.map((item, index) => {
        return <option key={index} value={item.relationType}>{item.relationType}</option>
    })
    const relationshipOptions = relationOptionList.map((item, index) => {
        if(relationType === item.relationType) {
            return item.relationship.map((item, index) =>
                <option key={index} value={item}>{item}</option>
            )
        }
        return true;
    })
    // 确认关系
    const [relationList,setRelationList] = useState([])
    const pushRelation = ()=>{
        const toPush = {
            id:newRelation.id,
            name:newRelation.name,
            relationType:relationType,
            relationship:relationship
        }
        console.log(toPush)
        setRelationList([...relationList,toPush])
    }
    // 删除关系
    const deleteRelation = (e)=>{
        const index = e.target.getAttribute("data-index")
        const newList = [...relationList]
        newList.splice(index,1)
        setRelationList(newList)
    }

    // 性格坐标
    const getOptionCharacteristic = (x,y) => {
        // 散点数据
        let marksData = [
            // 胆汁质
            {
            name: "主动",
            value: [79, 47],
            },
            {
            name: "乐观",
            value: [77, 54],
            },
            {
            name: "冲动",
            value: [75, 60],
            },
            {
            name: "善变",
            value: [71, 66],
            },
            {
            name: "激动",
            value: [66, 71],
            },
            {
            name: "好斗",
            value: [60, 75],
            },
            {
            name: "不安",
            value: [54, 77],
            },
            {
            name: "易怒",
            value: [47, 79],
            },
            // 抑郁质
            {
            name: "忧郁",
            value: [33, 79],
            },
            {
            name: "焦虑",
            value: [26, 77],
            },
            {
            name: "固执",
            value: [20, 75],
            },
            {
            name: "淡漠",
            value: [14, 71],
            },
            {
            name: "悲观",
            value: [9, 66],
            },
            {
            name: "保守",
            value: [5, 60],
            },
            {
            name: "腼腆",
            value: [3, 54],
            },
            {
            name: "文静",
            value: [1, 47],
            },
            // 粘液质
            {
            name: "被动",
            value: [1, 33],
            },
            {
            name: "谨慎",
            value: [3, 26],
            },
            {
            name: "细心",
            value: [5, 20],
            },
            {
            name: "平和",
            value: [9, 14],
            },
            {
            name: "克制",
            value: [14, 9],
            },
            {
            name: "可靠",
            value: [20, 5],
            },
            {
            name: "平稳",
            value: [26, 3],
            },
            {
            name: "镇静",
            value: [33, 1],
            },
            // 多血质
            {
            name: "领导",
            value: [47, 1],
            },
            {
            name: "无虑",
            value: [54, 3],
            },
            {
            name: "活泼",
            value: [60, 5],
            },
            {
            name: "悠闲",
            value: [66, 9],
            },
            {
            name: "机灵",
            value: [71, 14],
            },
            {
            name: "健谈",
            value: [75, 20],
            },
            {
            name: "开朗",
            value: [77, 26],
            },
            {
            name: "活跃",
            value: [79, 33],
            },
        ];
        // 中心线
        const centerLine = [
            {
            name: "不稳定",
            xAxis: 40,
            },
            {
            name: "外向",
            yAxis: 40,
            },
        ];
        // 中心点
        const centerMark = [
            {
            value: "点击区域更改定位",
            coord: [40+x, 40+y],
            },
        ];
  
        return {
            tooltip: {
            axisPointer: {
                show: true,
                type: "cross",
                lineStyle: {
                type: "dashed",
                width: 1,
                },
                label: {
                backgroundColor: "#555",
                },
            },
            },
            grid: {
            left: '10%',
            right: '10%',
            bottom: '10%',
            top: '10%',
            containLabel: true,
            },
            xAxis: {
            scale: true,
            axisLine: {
                show: false, //隐藏
            },
            axisLabel: {
                show: false, //隐藏
            },
            splitLine: {
                lineStyle: {
                color: "#eee",
                },
            },
            },
            yAxis: {
            scale: true,
            axisLine: {
                show: false, //隐藏
            },
            axisLabel: {
                show: false, //隐藏
            },
            splitLine: {
                lineStyle: {
                color: "#eee",
                },
            },
            },
            series: [
            {
                type: "scatter",
                data: marksData,
                label: {
                show: true,
                position: "bottom",
                formatter: "{b}",
                },
                itemStyle: {
                shadowBlur: 2,
                shadowColor: "rgba(120, 36, 50, 0.5)",
                shadowOffsetY: 1,
                color: function (e) {
                    let randomColor =
                    "rgba(" +
                    Math.floor(Math.random() * 240) +
                    "," +
                    Math.floor(Math.random() * 240) +
                    "," +
                    Math.floor(Math.random() * 240) +
                    "," +
                    ".8" +
                    ")";
                    return randomColor.substring();
                },
                },
                // 各象限区域
                markArea: {
                silent: true,
                data: [
                    // 第一象限
                    [
                    {
                        name: "胆汁质",
                        xAxis: 40, // x 轴开始位置
                        yAxis: 70, // y 轴结束位置(直接取最大值)
                        itemStyle: {
                        color: "rgba(56, 180, 139, .1)",
                        },
                        label: {
                        position: "inside",
                        color: "rgba(0, 0, 0, .1)",
                        fontSize: 22,
                        },
                    },
                    {
                        yAxis: 40, // y轴开始位置
                    },
                    ],
                    // 第二象限
                    [
                    {
                        name: "抑郁质",
                        yAxis: 70, // y 轴结束位置(直接取最大值)
                        itemStyle: {
                        color: "rgba(68, 97, 123, .1)",
                        },
                        label: {
                        position: "inside",
                        color: "rgba(0, 0, 0, .1)",
                        fontSize: 22,
                        },
                    },
                    {
                        xAxis: 40, // x 轴结束位置
                        yAxis: 40, // y轴开始位置
                    },
                    ],
                    // 第三象限
                    [
                    {
                        name: "粘液质",
                        yAxis: 40, // y 轴结束位置
                        itemStyle: {
                        color: "rgba(191, 120, 58, .1)",
                        },
                        label: {
                        position: "inside",
                        color: "rgba(0, 0, 0, .1)",
                        fontSize: 22,
                        },
                    },
                    {
                        xAxis: 40, // x 轴结束位置
                        yAxis: 10, // y轴开始位置
                    },
                    ],
                    // 第四象限
                    [
                    {
                        name: "多血质",
                        xAxis: 40, // x 轴开始位置
                        yAxis: 40, // y 轴结束位置
                        itemStyle: {
                        color: "rgba(116, 83, 153, .1)",
                        },
                        label: {
                        position: "inside",
                        color: "rgba(0, 0, 0, .1)",
                        fontSize: 22,
                        },
                    },
                    {
                        yAxis: 10, // y轴开始位置
                    },
                    ],
                ],
                },
                // 中心点交集象限轴
                markLine: {
                silent: true, // 是否不响应鼠标事件
                precision: 2, // 精度
                lineStyle: {
                    type: "solid",
                    color: "#00aca6",
                },
                label: {
                    color: "#00aca6",
                    position: "end",
                    formatter: "{b}",
                },
                data: centerLine,
                },
                // 中心点
                markPoint: {
                symbol: "roundRect",
                symbolSize: 15,
                itemStyle: {
                    normal: {
                        color: "rgba(255, 0, 0, 1)",
                        borderColor: "rgba(255, 0, 0, 0.4)",
                        borderWidth: 20,
                    },
                },
                label: {
                    position: "top",
                },
                data: centerMark,
                },
            },
            ],
        };
    }
    useEffect(() => {
        // 映射坐标系
        let myCharts = echarts.init(document.getElementById('persionality-dimension'))
        let x=0,y=0
        switch(data.temperament){
            case '胆汁质':
                switch(data.characteristic){
                    case '主动':x=39;y=7;break;
                    case '乐观':x=37;y=14;break;
                    case '冲动':x=35;y=20;break;
                    case '善变':x=31;y=26;break;
                    case '激动':x=26;y=31;break;
                    case '好斗':x=20;y=35;break;
                    case '不安':x=14;y=37;break;
                    case '易怒':x=7;y=39;break;
                    default:
                }break;
            case '抑郁质':
                switch(data.characteristic){
                    case '忧郁':x=-7;y=39;break;
                    case '焦虑':x=-14;y=37;break;
                    case '固执':x=-20;y=35;break;
                    case '淡漠':x=-26;y=31;break;
                    case '悲观':x=-31;y=26;break;
                    case '保守':x=-35;y=20;break;
                    case '腼腆':x=-37;y=14;break;
                    case '文静':x=-39;y=7;break;
                    default:
                }break;
            case '粘液质':
                switch(data.characteristic){
                    case '被动':x=-39;y=-7;break;
                    case '谨慎':x=-37;y=-14;break;
                    case '细心':x=-35;y=-20;break;
                    case '平和':x=-31;y=-26;break;
                    case '克制':x=-26;y=-31;break;
                    case '保守':x=-20;y=-35;break;
                    case '腼腆':x=-14;y=-37;break;
                    case '文静':x=-7;y=-39;break;
                    default:
                }break;
            case '多血质':
                switch(data.characteristic){
                    case '领导':x=7;y=-39;break;
                    case '无虑':x=14;y=-37;break;
                    case '活泼':x=20;y=-35;break;
                    case '悠闲':x=26;y=-31;break;
                    case '机灵':x=31;y=-26;break;
                    case '健谈':x=35;y=-20;break;
                    case '开朗':x=37;y=-14;break;
                    case '活泼':x=39;y=-7;break;
                    default:
                }break;
            default:
        }
        myCharts.setOption(getOptionCharacteristic(x,y))
    },[])
    const onPersonalityClick = (e) => {
        console.log('dimension=',e.nativeEvent.offsetX,e.nativeEvent.offsetY)
        const x = (e.nativeEvent.offsetX-150)/3
        const y = (150-e.nativeEvent.offsetY)/3
        let myCharts = echarts.init(document.getElementById('persionality-dimension'))
        myCharts.setOption(getOptionCharacteristic(x,y))
        if(x != 0){
            const tan = y/x
            let newData = {...data}
            if(x>0){
                if(tan<0){
                    newData = Object.assign(newData,{temperament:'多血质'})
                    if(tan<-3.73){
                        newData = Object.assign(newData,{characteristic:'领导'})
                    }else if(tan<-2.14){
                        newData = Object.assign(newData,{characteristic:'无虑'})
                    }else if(tan<-1.43){
                        newData = Object.assign(newData,{characteristic:'活泼'})
                    }else if(tan<-1){
                        newData = Object.assign(newData,{characteristic:'悠闲'})
                    }else if(tan<-0.7){
                        newData = Object.assign(newData,{characteristic:'机灵'})
                    }else if(tan<-0.47){
                        newData = Object.assign(newData,{characteristic:'健谈'})
                    }else if(tan<-0.27){
                        newData = Object.assign(newData,{characteristic:'开朗'})
                    }else{
                        newData = Object.assign(newData,{characteristic:'活跃'})
                    }
                }else{
                    newData = Object.assign(newData,{temperament:'胆汁质'})
                    if(tan<0.27){
                        newData = Object.assign(newData,{characteristic:'主动'})
                    }else if(tan<0.47){
                        newData = Object.assign(newData,{characteristic:'乐观'})
                    }else if(tan<0.7){
                        newData = Object.assign(newData,{characteristic:'冲动'})
                    }else if(tan<1){
                        newData = Object.assign(newData,{characteristic:'善变'})
                    }else if(tan<1.43){
                        newData = Object.assign(newData,{characteristic:'激动'})
                    }else if(tan<2.14){
                        newData = Object.assign(newData,{characteristic:'好斗'})
                    }else if(tan<3.73){
                        newData = Object.assign(newData,{characteristic:'不安'})
                    }else{
                        newData = Object.assign(newData,{characteristic:'易怒'})
                    }
                }
            }else if(x<0){
                if(tan<0){
                    newData = Object.assign(newData,{temperament:'抑郁质'})
                    if(tan<-3.73){
                        newData = Object.assign(newData,{characteristic:'忧郁'})
                    }else if(tan<-2.14){
                        newData = Object.assign(newData,{characteristic:'焦虑'})
                    }else if(tan<-1.43){
                        newData = Object.assign(newData,{characteristic:'固执'})
                    }else if(tan<-1){
                        newData = Object.assign(newData,{characteristic:'淡漠'})
                    }else if(tan<-0.7){
                        newData = Object.assign(newData,{characteristic:'悲观'})
                    }else if(tan<-0.47){
                        newData = Object.assign(newData,{characteristic:'保守'})
                    }else if(tan<-0.27){
                        newData = Object.assign(newData,{characteristic:'腼腆'})
                    }else{
                        newData = Object.assign(newData,{characteristic:'文静'})
                    }
                }else{
                    newData = Object.assign(newData,{temperament:'粘液质'})
                    if(tan<0.27){
                        newData = Object.assign(newData,{characteristic:'被动'})
                    }else if(tan<0.47){
                        newData = Object.assign(newData,{characteristic:'谨慎'})
                    }else if(tan<0.7){
                        newData = Object.assign(newData,{characteristic:'细心'})
                    }else if(tan<1){
                        newData = Object.assign(newData,{characteristic:'平和'})
                    }else if(tan<1.43){
                        newData = Object.assign(newData,{characteristic:'克制'})
                    }else if(tan<2.14){
                        newData = Object.assign(newData,{characteristic:'可靠'})
                    }else if(tan<3.73){
                        newData = Object.assign(newData,{characteristic:'平稳'})
                    }else{
                        newData = Object.assign(newData,{characteristic:'镇静'})
                    }
                }
            }
            setData(newData)
        }
    }
    // 技能
    const [skillName,setSkillName] = useState('技能名称')
    const [skillType,setSkillType] = useState('')
    const [skillProficiency,setSkillProficiency] = useState('')
    const onSkillNameChange = (e)=>{
        setSkillName(e.target.value)
    }
    const onSkillTypeChange = (e)=>{
        setSkillType(e.target.value)
    }
    const onSkillProficiencyChange = (e)=>{
        setSkillProficiency(e.target.value)
    }
    const [skillList,setSkillList] = useState([])
    const addSkill = ()=>{
        const newSkill = {
            name:skillName,
            type:skillType,
            proficiency:skillProficiency
        }
        setSkillList([...skillList,newSkill])
    }
    const deleteSkill = (e)=>{
        const index = e.target.getAttribute("data-index")
        const newList = [...skillList]
        newList.splice(index,1)
        setSkillList(newList)
    }
    // 财物
    const [belongingName,setBelongingName] = useState('物品名称')
    const [belongingType,setBelongingType] = useState('')
    const [belongingState,setBelongingState] = useState('')
    const onBelongingNameChange = (e)=>{
        setBelongingName(e.target.value)
    }
    const onBelongingTypeChange = (e)=>{
        setBelongingType(e.target.value)
    }
    const onBelongingStateChange = (e)=>{
        setBelongingState(e.target.value)
    }
    const [belongingList,setBelongingList] = useState([])
    const addBelonging = ()=>{
        const newBelonging = {
            name:belongingName,
            type:belongingType,
            state:belongingState
        }
        setBelongingList([...belongingList,newBelonging])
    }
    const deleteBelonging = (e)=>{
        const index = e.target.getAttribute("data-index")
        const newList = [...belongingList]
        newList.splice(index,1)
        setBelongingList(newList)
    }
    const onWealthChange = (e)=>{
        const newData = Object.assign({...data},{wealth:e.target.value})
        setData(newData)
    }
    // 战斗能力
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
    useEffect(() => {
        let myCharts = echarts.init(document.getElementById('combat-radar-component'))
        myCharts.setOption(getCombatOption(data))
    },[])
    // 力量
    const onStrengthChange = (newValue) => {
        let newData = Object.assign({...data},{strength:newValue})
        setData(newData)
        let myCharts = echarts.init(document.getElementById('combat-radar-component'))
        myCharts.setOption(getCombatOption(data))
    };
    // 敏捷
    const onAgilityChange = (newValue) => {
        let newData = Object.assign({...data},{agility:newValue})
        setData(newData)
        let myCharts = echarts.init(document.getElementById('combat-radar-component'))
        myCharts.setOption(getCombatOption(data))
    };
    // 智力
    const onIntelligenceChange = (newValue) => {
        let newData = Object.assign({...data},{intelligence:newValue})
        setData(newData)
        let myCharts = echarts.init(document.getElementById('combat-radar-component'))
        myCharts.setOption(getCombatOption(data))
    };
    // 体质
    const onPhysiqueChange = (newValue) => {
        let newData = Object.assign({...data},{physique:newValue})
        setData(newData)
        let myCharts = echarts.init(document.getElementById('combat-radar-component'))
        myCharts.setOption(getCombatOption(data))
    };
    // 意志
    const onWillChange = (newValue) => {
        let newData = Object.assign({...data},{will:newValue})
        setData(newData)
        let myCharts = echarts.init(document.getElementById('combat-radar-component'))
        myCharts.setOption(getCombatOption(data))
    };
    return(
        <div className='container-form'>
            <a id='revise-goback' onClick={()=>{navigate(-1)}}>返回</a>
            <form onSubmit={handleSubmit}>
            {/* <form> */}
                <div className='row'>
                    <div className='module' id='basic-info'>
                        <h3>基本信息</h3>
                        <p>想象一下，你的人物在深夜里漫步，忽然发现自己迷路了。Ta不知不觉到了一个布满铁丝网和探照灯的地方，这时一名臂戴红袖章身穿军大衣的人注意到了Ta。</p>
                        <p>“站住，不许动！”，这是警卫说的第一句话。</p>
                        <p>“你是谁？干什么的？”</p>
                        <p>你的人物要如何回答警卫的问题呢？</p>
                        <div className='line'>
                            <label>
                                姓名:
                                <input type='text' onChange={handleChangeName} value={data.name}/>
                            </label>
                            <label>
                                年龄:
                                <input type='number' onChange={handleChangeAge} value={data.age}/>
                            </label>
                        </div>
                        <div className='line'>
                            <label>
                                种族:
                                <input type='text' onChange={handleChangeRace} value={data.race}/>
                            </label>
                            <label>
                                民族:
                                <input type='text' onChange={handleChangeNation} value={data.nation}/>
                            </label>
                        </div>
                        <div className='line'>
                            <label>
                                信仰:
                                <input type='text' onChange={handleChangeBelief} value={data.belief}/>
                            </label>
                            <label>
                                职业:
                                <input type='text' onChange={handleChangeJob} value={data.job}/>
                            </label>
                        </div>
                        <div className='line'>
                            <label>
                                性别:
                                <select onChange={handleChangeGender} value = {data.gender}>
                                    <option value='请输入'>其他</option>
                                    <option value='' disabled>未选择</option>
                                    <option value='男'>男</option>
                                    <option value='女'>女</option>
                                </select>
                                <input type='text' onChange={handleChangeGender} value={data.gender} style={{display:showElemOtherGender}}/>
                            </label>
                        </div>
                    </div>
                    <div className='module' id='personality'>
                        <h3>人格</h3>
                        <p>
                            你是霍格沃茨魔法学院的分院帽，现在有一名新生来到你面前，等待分配学院。
                        </p>
                        <p>
                            当年轻的巫师将你戴在头上的那一刻，你需要根据Ta的性格决定他会被分配到哪个学院。
                        </p>
                        <p>（您可以从级联列表中选择，也可以直接点击坐标系中位置来设置人物性格）</p>
                        <div id='persionality-dimension-container'>
                            {/* <img id='persionality-dimension' src={personalityDimension} alt='personality dimension' /> */}
                            <div id='persionality-dimension' onClick={onPersonalityClick} />
                        </div>
                        <div className='line'>
                            <label>
                                <select value={data.temperament} onChange={handleChangeTemperament}>{temperament}</select>
                                <select value={data.characteristic} onChange={handleChangeCharacteristic}>{characteristic}</select>
                            </label>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='module' id='appearence'>
                        <h3>外貌</h3>
                        <p>
                            你是一名警探，现在有一名逃犯正逍遥法外，你的上司命令你去张贴该逃犯的通缉令，你应当如何描述这名逃犯的特征？
                        </p>
                        <div className='line'>
                            <div id='apperence-basic-info'>
                                <label>
                                    身高(cm):
                                    <input type='number' onChange={handleChangeHeight} value={data.height}/>
                                </label>
                                <label>
                                    体型:
                                    <select onChange={handleChangeFigure} value ={data.figure}>
                                        <option value='' disabled>未选择</option>
                                        <option value='枯槁'>枯槁</option>
                                        <option value='纤细'>纤细</option>
                                        <option value='匀称'>匀称</option>
                                        <option value='强壮'>强壮</option>
                                        <option value='肥胖'>肥胖</option>
                                    </select>
                                </label>
                            </div>
                            <div className='slider-container' id='charm'>
                                    <div className='title'>
                                        魅力:
                                    </div>
                                    <div className='slider'>
                                        <Slider
                                            min={0}
                                            max={100}
                                            style={{
                                                width: '100%'
                                            }}
                                            onChange={onCharmChange}
                                            value={typeof data.charm === 'number' ? data.charm : 0}
                                        />
                                    </div>
                                    <div className='input'>
                                        <InputNumber
                                            min={0}
                                            max={100}
                                            style={{
                                                margin: '0 16px',
                                                width: '100%'
                                            }}
                                            value={data.charm}
                                            onChange={onCharmChange}
                                        />
                                    </div>
                                </div>
                            <div className='scars-container'>
                                身体特征:
                                <div id='new-scar'>
                                    <input type="text" value={bodyPart} onChange={onBodyPartChange} />
                                    <select onChange={onScarTypeChange} defaultValue ={''}>
                                        <option value='' disabled>未选择</option>
                                        <option value='纹身'>纹身</option>
                                        <option value='疤痕'>疤痕</option>
                                        <option value='胎记'>胎记</option>
                                        <option value='残疾'>残疾</option>
                                    </select>
                                    {/* <input type="text" value={scarType} onChange={onScarTypeChange} /> */}
                                    <input type="text" value={scarShape} onChange={onScarShapeChange }/>
                                    <button onClick={addScar} type='button'>添加</button>
                                </div>
                                <table id="customers">
                                    <tbody>
                                    <tr>
                                        <th>部位</th>
                                        <th>类型</th>
                                        <th>外形</th>
                                    </tr>
                                    {scarList.map((item, index)=>{
                                        // console.log(item)
                                        return (
                                            <tr key={index} className="alt">
                                                <td>
                                                    <h5>{item.bodyPart}</h5>
                                                </td>
                                                <td>
                                                    <h5>{item.scarType}</h5>
                                                </td>
                                                <td>
                                                    <h5>{item.scarShape}</h5>
                                                </td>
                                                <td className='td-btn'>
                                                    <button onClick={deleteScar} data-index={index}  type='button'>删除</button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className='module' id='ability'>
                        <h3>能力</h3>
                        <p>
                            你是唐高祖李渊的次子李世民，不知为何你的父亲决定禅位于你。国家百废待兴，而刚坐上皇位的你正因为缺少人才而焦头烂额。
                        </p>
                        <p>
                            好在今年科举新进了一批进士，你需要根据他们的总和能力为他们指派官职。
                        </p>
                        <div className='line'>
                            <div id='radar-component'>
                                {/* <ReactEcharts
                                    id="five-dimensions"
                                    option={this.getOption(this.state.data)}
                                    onChartReady={this.onChartReadyCallback}
                                /> */}
                            </div>
                        </div>
                        <div className='line'>
                            <label>
                                <div className='slider-container' id='diplomacy'>
                                    <div className='title'>
                                        外交:
                                    </div>
                                    <div className='slider'>
                                        <Slider
                                            min={0}
                                            max={100}
                                            style={{
                                                width: '100%'
                                            }}
                                            onChange={onDiplomacyChange}
                                            value={typeof data.diplomacy === 'number' ? data.diplomacy : 0}
                                        />
                                    </div>
                                    <div className='input'>
                                        <InputNumber
                                            min={0}
                                            max={100}
                                            style={{
                                                margin: '0 16px',
                                                width: '100%'
                                            }}
                                            value={data.diplomacy}
                                            onChange={onDiplomacyChange}
                                        />
                                    </div>
                                </div>
                            </label>
                        </div>
                        <div className='line'>
                            <label>
                                <div className='slider-container' id='military'>
                                    <div className='title'>
                                        军事:
                                    </div>
                                    <div className='slider'>
                                        <Slider
                                            min={0}
                                            max={100}
                                            style={{
                                                width: '100%'
                                            }}
                                            onChange={onMilitaryChange}
                                            value={typeof data.military === 'number' ? data.military : 0}
                                        />
                                    </div>
                                    <div className='input'>
                                        <InputNumber
                                            min={0}
                                            max={100}
                                            style={{
                                                margin: '0 16px',
                                                width: '100%'
                                            }}
                                            value={data.military}
                                            onChange={onMilitaryChange}
                                        />
                                    </div>
                                </div>
                            </label>
                        </div>
                        <div className='line'>
                            <label>
                                <div className='slider-container' id='intrigue'>
                                    <div className='title'>
                                        密谋:
                                    </div>
                                    <div className='slider'>
                                        <Slider
                                            min={0}
                                            max={100}
                                            style={{
                                                width: '100%'
                                            }}
                                            onChange={onIntrigueChange}
                                            value={typeof data.intrigue === 'number' ? data.intrigue : 0}
                                        />
                                    </div>
                                    <div className='input'>
                                        <InputNumber
                                            min={0}
                                            max={100}
                                            style={{
                                                margin: '0 16px',
                                                width: '100%'
                                            }}
                                            value={data.intrigue}
                                            onChange={onIntrigueChange}
                                        />
                                    </div>
                                </div>
                            </label>
                        </div>
                        <div className='line'>
                            <label>
                                <div className='slider-container' id='stewardship'>
                                    <div className='title'>
                                        管理:
                                    </div>
                                    <div className='slider'>
                                        <Slider
                                            min={0}
                                            max={100}
                                            style={{
                                                width: '100%'
                                            }}
                                            onChange={onStewardshipChange}
                                            value={typeof data.stewardship === 'number' ? data.stewardship : 0}
                                        />
                                    </div>
                                    <div className='input'>
                                        <InputNumber
                                            min={0}
                                            max={100}
                                            style={{
                                                margin: '0 16px',
                                                width: '100%'
                                            }}
                                            value={data.stewardship}
                                            onChange={onStewardshipChange}
                                        />
                                    </div>
                                </div>
                            </label>
                        </div>
                        <div className='line'>
                            <label>
                                <div className='slider-container' id='knowledge'>
                                    <div className='title'>
                                        学识:
                                    </div>
                                    <div className='slider'>
                                        <Slider
                                            min={0}
                                            max={100}
                                            style={{
                                                width: '100%'
                                            }}
                                            onChange={onKnowledgeChange}
                                            value={typeof data.knowledge === 'number' ? data.knowledge : 0}
                                        />
                                    </div>
                                    <div className='input'>
                                        <InputNumber
                                            min={0}
                                            max={100}
                                            style={{
                                                margin: '0 16px',
                                                width: '100%'
                                            }}
                                            value={data.knowledge}
                                            onChange={onKnowledgeChange}
                                        />
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className='module' id='combat-ability'>
                        <h3>战斗能力</h3>
                        <p>
                            在武侠小说和热血漫画当中战斗有着举足轻重的地位，在另一些作品中则不然，不论如何，这些能力指标都必然存在着。
                        </p>
                        <div className='line'>
                            <div id='combat-radar-component' />
                        </div>
                        <div className='line'>
                            <label>
                                <div className='slider-container' id='strength'>
                                    <div className='title'>
                                        力量:
                                    </div>
                                    <div className='slider'>
                                        <Slider
                                            min={0}
                                            max={100}
                                            style={{
                                                width: '100%'
                                            }}
                                            onChange={onStrengthChange}
                                            value={typeof data.strength === 'number' ? data.strength : 0}
                                        />
                                    </div>
                                    <div className='input'>
                                        <InputNumber
                                            min={0}
                                            max={100}
                                            style={{
                                                margin: '0 16px',
                                                width: '100%'
                                            }}
                                            value={data.strength}
                                            onChange={onStrengthChange}
                                        />
                                    </div>
                                </div>
                            </label>
                        </div>
                        <div className='line'>
                            <label>
                                <div className='slider-container' id='agility'>
                                    <div className='title'>
                                        敏捷:
                                    </div>
                                    <div className='slider'>
                                        <Slider
                                            min={0}
                                            max={100}
                                            style={{
                                                width: '100%'
                                            }}
                                            onChange={onAgilityChange}
                                            value={typeof data.agility === 'number' ? data.agility : 0}
                                        />
                                    </div>
                                    <div className='input'>
                                        <InputNumber
                                            min={0}
                                            max={100}
                                            style={{
                                                margin: '0 16px',
                                                width: '100%'
                                            }}
                                            value={data.agility}
                                            onChange={onAgilityChange}
                                        />
                                    </div>
                                </div>
                            </label>
                        </div>
                        <div className='line'>
                            <label>
                                <div className='slider-container' id='intelligence'>
                                    <div className='title'>
                                        智力:
                                    </div>
                                    <div className='slider'>
                                        <Slider
                                            min={0}
                                            max={100}
                                            style={{
                                                width: '100%'
                                            }}
                                            onChange={onIntelligenceChange}
                                            value={typeof data.intelligence === 'number' ? data.intelligence : 0}
                                        />
                                    </div>
                                    <div className='input'>
                                        <InputNumber
                                            min={0}
                                            max={100}
                                            style={{
                                                margin: '0 16px',
                                                width: '100%'
                                            }}
                                            value={data.intelligence}
                                            onChange={onIntelligenceChange}
                                        />
                                    </div>
                                </div>
                            </label>
                        </div>
                        <div className='line'>
                            <label>
                                <div className='slider-container' id='physique'>
                                    <div className='title'>
                                        体质:
                                    </div>
                                    <div className='slider'>
                                        <Slider
                                            min={0}
                                            max={100}
                                            style={{
                                                width: '100%'
                                            }}
                                            onChange={onPhysiqueChange}
                                            value={typeof data.physique === 'number' ? data.physique : 0}
                                        />
                                    </div>
                                    <div className='input'>
                                        <InputNumber
                                            min={0}
                                            max={100}
                                            style={{
                                                margin: '0 16px',
                                                width: '100%'
                                            }}
                                            value={data.physique}
                                            onChange={onPhysiqueChange}
                                        />
                                    </div>
                                </div>
                            </label>
                        </div>
                        <div className='line'>
                            <label>
                                <div className='slider-container' id='will'>
                                    <div className='title'>
                                        意志:
                                    </div>
                                    <div className='slider'>
                                        <Slider
                                            min={0}
                                            max={100}
                                            style={{
                                                width: '100%'
                                            }}
                                            onChange={onWillChange}
                                            value={typeof data.will === 'number' ? data.will : 0}
                                        />
                                    </div>
                                    <div className='input'>
                                        <InputNumber
                                            min={0}
                                            max={100}
                                            style={{
                                                margin: '0 16px',
                                                width: '100%'
                                            }}
                                            value={data.will}
                                            onChange={onWillChange}
                                        />
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='module' id='skills'>
                        <h3>技能</h3>
                        <p>Ta掌握五种语言？Ta会飞檐走壁？Ta像X战警里的变种人那样有超能力？Ta的大拇指可以九十度弯曲？</p>
                        <p>Ta的技能掌握程度怎么样？是花了一晚上速成，还是已经练习了十几年？</p>
                        <div className='line'>
                            <div id='skills-container'>
                                <div id='new-skill'>
                                    技能名称:
                                    <input type="text" value={skillName} onChange={onSkillNameChange} />
                                    技能种类:
                                    <select onChange={onSkillTypeChange} defaultValue ={''}>
                                        <option value='' disabled>未选择</option>
                                        <option value='生活技能'>生活技能</option>
                                        <option value='专业技能'>专业技能</option>
                                        <option value='语言技能'>语言技能</option>
                                        <option value='战斗技能'>战斗技能</option>
                                        <option value='超能力'>超能力</option>
                                    </select>
                                    熟练度:
                                    <select onChange={onSkillProficiencyChange} defaultValue ={''}>
                                        <option value='' disabled>未选择</option>
                                        <option value='入门'>入门</option>
                                        <option value='掌握'>掌握</option>
                                        <option value='熟练'>熟练</option>
                                        <option value='精通'>精通</option>
                                    </select>
                                    <button onClick={addSkill} type='button'>添加</button>
                                </div>
                                <table>
                                    <tbody>
                                    <tr>
                                        <th>技能名称</th>
                                        <th>技能种类</th>
                                        <th>熟练度</th>
                                    </tr>
                                    {skillList.map((item, index)=>{
                                        // console.log(item)
                                        return (
                                            <tr key={index} className="alt">
                                                <td>
                                                    <h5>{item.name}</h5>
                                                </td>
                                                <td>
                                                    <h5>{item.type}</h5>
                                                </td>
                                                <td>
                                                    <h5>{item.proficiency}</h5>
                                                </td>
                                                <td className='td-btn'>
                                                    <button onClick={deleteSkill} data-index={index}  type='button'>删除</button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className='module' id='belongings'>
                        <h3>财物</h3>
                        <p>钱财是身外之物，虽说如此，便是和尚也要有衣钵。</p>
                        <div className='line'>
                            <div className='alt-add-box' id='belongings-container'>
                                <label>
                                    财富状况:
                                    <select onChange={onWealthChange} value ={data.wealth}>
                                        <option value='' disabled>未选择</option>
                                        <option value='负债'>负债</option>
                                        <option value='贫困'>贫困</option>
                                        <option value='温饱'>温饱</option>
                                        <option value='小康'>小康</option>
                                        <option value='富裕'>富裕</option>
                                        <option value='土豪'>土豪</option>
                                        <option value='寡头'>寡头</option>
                                        <option value='终产者'>终产者</option>
                                    </select>
                                </label>
                                <div id='new-belonging'>
                                    物品名称:
                                    <input type="text" value={belongingName} onChange={onBelongingNameChange} />
                                    物品种类:
                                    <select onChange={onBelongingTypeChange} defaultValue ={''}>
                                        <option value='' disabled>未选择</option>
                                        <option value='工具'>工具</option>
                                        <option value='衣冠'>衣冠</option>
                                        <option value='武器'>武器</option>
                                        <option value='饰品'>饰品</option>
                                        <option value='玩具'>玩具</option>
                                        <option value='其他'>其他</option>
                                    </select>
                                    保存状态:
                                    <select onChange={onBelongingStateChange} defaultValue ={''}>
                                        <option value='' disabled>未选择</option>
                                        <option value='破损'>破损</option>
                                        <option value='老旧'>老旧</option>
                                        <option value='常规'>常规</option>
                                        <option value='崭新'>崭新</option>
                                    </select>
                                    <button onClick={addBelonging} type='button'>添加</button>
                                </div>
                                <table>
                                    <tbody>
                                    <tr>
                                        <th>物品名称</th>
                                        <th>物品种类</th>
                                        <th>保存状态</th>
                                    </tr>
                                    {belongingList.map((item, index)=>{
                                        // console.log(item)
                                        return (
                                            <tr key={index} className="alt">
                                                <td>
                                                    <h5>{item.name}</h5>
                                                </td>
                                                <td>
                                                    <h5>{item.type}</h5>
                                                </td>
                                                <td>
                                                    <h5>{item.state}</h5>
                                                </td>
                                                <td className='td-btn'>
                                                    <button onClick={deleteBelonging} data-index={index}  type='button'>删除</button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='module' id='relationship'>
                        <h3>关系</h3>
                        <p>
                            人是一切社会关系的总和，脱离了人类社会，个体便无法产生意识这一人的基本属性。即便是流落荒岛的鲁滨逊，他的一切生产技能也是在人类社会所学到的，他还解救了一名俘虏并给他起名为“星期五”。
                        </p>
                        <p>
                            你的人物亦不能脱离人群而存在，他不是超人，不是隐居山林的查拉图斯特拉。
                        </p>
                        <div className='line'>
                            当前选中的人物:{recentSelectedCharacter}
                            <label>
                                <select value={relationType} onChange={(e)=>setRelationType(e.target.value)}>{relationTypeOptions}</select>
                                <select value={relationship} onChange={(e)=>setRelationShip(e.target.value)}>{relationshipOptions}</select>
                                <button type='button' onClick={pushRelation}>
                                    确认
                                </button>
                            </label>
                        </div>
                        <div id='relations'>
                        <table id="relation-table">
                            <tbody>
                            <tr>
                                <th>姓名</th>
                                <th>关系类别</th>
                                <th>关系</th>
                            </tr>
                            {relationList.map((item, index)=>{
                                // console.log(item)
                                return (
                                    <tr key={index} className="alt">
                                        <td>
                                            <h5>{item.name}</h5>
                                        </td>
                                        <td>
                                            <h5>{item.relationType}</h5>
                                        </td>
                                        <td>
                                            <h5>{item.relationship}</h5>
                                        </td>
                                        <td className='td-btn'>
                                            <button onClick={deleteRelation} data-index={index}  type='button'>删除</button>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                        </div>
                        <div id='relation-search-box'>
                            {/* <Search
                                placeholder="请输入人物姓名(可以少输但不能输错)"
                                onSearch={onSearch}
                                onChange={onSearch}
                                style={{
                                    width: '100%',
                                }}
                            /> */}
                            <Input
                                placeholder="请输入人物姓名(可以少输但不能输错，请不要按回车键否则表单会自动提交)"
                                style={{
                                    width: '100%',
                                }}
                                type={Input.TextArea}
                                onPressEnter={onSearch}
                                onChange={onSearch}
                            />
                            <div id='related-characters'>
                                {relatedCharacters}
                            </div>
                        </div>
                    </div>
                </div>
                <button id='submit' type='submit' value='submit'>
                    提交
                </button>
            </form>
        </div>
    )
}

export default CharacterRevise