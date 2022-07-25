import React from 'react'
import './CharacterForm.css'
import personalityDimension from './personality-dimension.jpeg'
import ReactEcharts from "echarts-for-react";
import * as echarts from 'echarts';
import { InputNumber, Slider } from 'antd';
import axio from 'axios'

class CharacterForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data:{
                name:'',
                age:'',
                race:'',
                nation:'',
                belief:'',
                job:'',
                gender:'',
                temperament:this.persionality[0].temperament,
                characteristic:this.persionality[0].characteristic[0],
                diplomacy:50,
                military:50,
                intrigue:50,
                stewardship:50,
                knowledge:50
            },
            showElemOtherGender:'none',
        };
    }

    persionality = [
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

    handleSubmit = async (e)=>{
        e.preventDefault();
        console.log(this.state.data)
        const res = await axio.post('http://localhost:5000/new',this.state.data)
        console.log(res)
        if(res.data.message === '成功创建人物')alert('成功创建人物')
            else if(res.data.message === '该人物已存在')alert('该人物已存在')
    }
    // 姓名
    handleChangeName = (e) => {
        let newData = Object.assign(this.state.data,{name:e.target.value})
        this.setState(()=>({data:newData}))
    }
    // 年龄
    handleChangeAge = (e) => {
        let newData = Object.assign(this.state.data,{age:e.target.value})
        this.setState(()=>({data:newData}))
    }
    // 种族
    handleChangeRace = (e) => {
        let newData = Object.assign(this.state.data,{race:e.target.value})
        this.setState(()=>({data:newData}))
    }
    // 民族
    handleChangeNation = (e) => {
        let newData = Object.assign(this.state.data,{nation:e.target.value})
        this.setState(()=>({data:newData}))
    }
    // 信仰
    handleChangeBelief = (e) => {
        let newData = Object.assign(this.state.data,{belief:e.target.value})
        this.setState(()=>({data:newData}))
    }
    // 职业
    handleChangeJob = (e) => {
        let newData = Object.assign(this.state.data,{job:e.target.value})
        this.setState(()=>({data:newData}))
    }
    // 性别
    handleChangeGender = (e) => {
        let newData = Object.assign(this.state.data,{gender:e.target.value})
        this.setState(()=>({data:newData}))
        if(e.target.value === '请输入'){
            this.setState(()=>({showElemOtherGender:'inline'}))
        }else if(e.target.value === '男' || e.target.value === '女'){
            this.setState(()=>({showElemOtherGender:'none'}))
        }
    }
    // 气质
    handleChangeTemperament = (e) => {
        let newData = Object.assign(this.state.data,{temperament:e.target.value})
        this.setState(()=>({data:newData}))
        this.persionality.map((item, index) => {
          if(e.target.value === item.temperament) {
            let newData = Object.assign(this.state.data,{characteristic:item.characteristic[0]})
            this.setState({data:newData});
          }
          return true;
        })
    }
    // 特质
    handleChangeCharacteristic = (e) => {
        let newData = Object.assign(this.state.data,{characteristic:e.target.value})
        this.setState(()=>({data:newData}))
    }

    getOption(item) {
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
    componentDidMount(){
        let myCharts = echarts.init(document.getElementById('radar-component'))
        myCharts.setOption(this.getOption(this.state.data))
    }
    // 外交
    onDiplomacyChange = (newValue) => {
        let newData = Object.assign(this.state.data,{diplomacy:newValue})
        this.setState(()=>({data:newData}))
        let myCharts = echarts.init(document.getElementById('radar-component'))
        myCharts.setOption(this.getOption(this.state.data))
    };
    // 军事
    onMilitaryChange = (newValue) => {
        let newData = Object.assign(this.state.data,{military:newValue})
        this.setState(()=>({data:newData}))
        let myCharts = echarts.init(document.getElementById('radar-component'))
        myCharts.setOption(this.getOption(this.state.data))
    };
    // 密谋
    onIntrigueChange = (newValue) => {
        let newData = Object.assign(this.state.data,{intrigue:newValue})
        this.setState(()=>({data:newData}))
        let myCharts = echarts.init(document.getElementById('radar-component'))
        myCharts.setOption(this.getOption(this.state.data))
    };
    // 管理
    onStewardshipChange = (newValue) => {
        let newData = Object.assign(this.state.data,{stewardship:newValue})
        this.setState(()=>({data:newData}))
        let myCharts = echarts.init(document.getElementById('radar-component'))
        myCharts.setOption(this.getOption(this.state.data))
    };
    // 学识
    onKnowledgeChange = (newValue) => {
        let newData = Object.assign(this.state.data,{knowledge:newValue})
        this.setState(()=>({data:newData}))
        let myCharts = echarts.init(document.getElementById('radar-component'))
        myCharts.setOption(this.getOption(this.state.data))
    };

    render(){
        // 生成性格选项
        const temperament = this.persionality.map((item, index) => {
            return <option key={index} value={item.temperament}>{item.temperament}</option>
        })
        const characteristic = this.persionality.map((item, index) => {
            if(this.state.data.temperament === item.temperament) {
                return item.characteristic.map((item, index) =>
                    <option key={index} value={item}>{item}</option>
                )
            }
            return true;
        })
        return(
            <div className='container-form'>
                <form onSubmit={this.handleSubmit}>
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
                                    <input type='text' onChange={this.handleChangeName} value={this.state.data.name}/>
                                </label>
                                <label>
                                    年龄:
                                    <input type='number' onChange={this.handleChangeAge} value={this.state.data.age}/>
                                </label>
                            </div>
                            <div className='line'>
                                <label>
                                    种族:
                                    <input type='text' onChange={this.handleChangeRace} value={this.state.data.race}/>
                                </label>
                                <label>
                                    民族:
                                    <input type='text' onChange={this.handleChangeNation} value={this.state.data.nation}/>
                                </label>
                            </div>
                            <div className='line'>
                                <label>
                                    信仰:
                                    <input type='text' onChange={this.handleChangeBelief} value={this.state.data.belief}/>
                                </label>
                                <label>
                                    职业:
                                    <input type='text' onChange={this.handleChangeJob} value={this.state.data.job}/>
                                </label>
                            </div>
                            <div className='line'>
                                <label>
                                    性别:
                                    {/* <select onChange={this.handleChangeGender} value={this.state.data.gender}> */}
                                    <select onChange={this.handleChangeGender} defaultValue ={''}>
                                        <option value='' disabled>未选择</option>
                                        <option value='男'>男</option>
                                        <option value='女'>女</option>
                                        <option value='请输入'>其他</option>
                                    </select>
                                    <input type='text' onChange={this.handleChangeGender} value={this.state.data.gender} style={{display:this.state.showElemOtherGender}}/>
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
                            <p>（这个模块还没有实装，作者的想法是用户可以直接在下面这个坐标系上进行点击，通过坐标获得具体的人格类型。）</p>
                            <div id='persionality-dimension-container'>
                                <img id='persionality-dimension' src={personalityDimension} alt='personality dimension' />
                            </div>
                            <div className='line'>
                                <label>
                                    <select value={this.state.temperament} onChange={this.handleChangeTemperament.bind(this)}>{temperament}</select>
                                    <select value={this.state.characteristic} onChange={this.handleChangeCharacteristic.bind(this)}>{characteristic}</select>
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
                                身高
                                体型
                                相貌辨识度
                                残疾
                                纹身、疤痕和胎记
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
                                                onChange={this.onDiplomacyChange}
                                                value={typeof this.state.data.diplomacy === 'number' ? this.state.data.diplomacy : 0}
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
                                                value={this.state.data.diplomacy}
                                                onChange={this.onDiplomacyChange}
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
                                                onChange={this.onMilitaryChange}
                                                value={typeof this.state.data.military === 'number' ? this.state.data.military : 0}
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
                                                value={this.state.data.military}
                                                onChange={this.onMilitaryChange}
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
                                                onChange={this.onIntrigueChange}
                                                value={typeof this.state.data.intrigue === 'number' ? this.state.data.intrigue : 0}
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
                                                value={this.state.data.intrigue}
                                                onChange={this.onIntrigueChange}
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
                                                onChange={this.onStewardshipChange}
                                                value={typeof this.state.data.stewardship === 'number' ? this.state.data.stewardship : 0}
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
                                                value={this.state.data.stewardship}
                                                onChange={this.onStewardshipChange}
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
                                                onChange={this.onKnowledgeChange}
                                                value={typeof this.state.data.knowledge === 'number' ? this.state.data.knowledge : 0}
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
                                                value={this.state.data.knowledge}
                                                onChange={this.onKnowledgeChange}
                                            />
                                        </div>
                                    </div>
                                </label>
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
}

export default CharacterForm