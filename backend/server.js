const express = require('express')
const cors = require('cors')
const bodyParse = require('body-parser')
const neo4j = require('neo4j-driver')
const {v4:uuid} = require('uuid')

// // // // // // // // // // // //
// 将这里更改为您的neo4j数据库所在IP、用户名和密码
// // // // // // // // // // // //
// 
// 这是IP，以bolt://开头，例如bolt://127.0.0.1
// const db = 'bolt://xx.xx.xx.xx'
// 这是用户名
// const dbuser = 'neo4j'
// 这是密码
// const dbpassword = 'test'
// 
// // // // // // // // // // // //


// const cql_root = `MATCH (n) RETURN n`
// let cql_name = ''
// const session = driver.session()

// let results

// session
//     .run(cql_root)
//     .then((r)=>{
//         results = r.records
//         session.close()
//         results.forEach((item,index)=>{
//             console.log(index,item._fields[0].properties)
//         })
//     })
//     .catch((error)=>{
//         results = error.message
//         console.log(results)
//     })

// const create = `create (${data.name}:Character${data})`

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.listen(5000,()=>{
    console.log("Server running http://localhost:5000")
})

const driver = neo4j.driver(db,neo4j.auth.basic(dbuser,dbpassword),{
    maxTransactionRetryTime:3000
})

app.post('/new',async (req,res)=>{
    const data = req.body
    const id = uuid()
    let str = '{'
    for(let key in data.data){
		let element = data.data[key]
        if(typeof(element) === 'string')
		    str += key + ":\'" + element + "\',";
        else
        str += key + ":" + element + ",";
	}
    str += `id:\'${id}\'}`
    console.log(data.data)
    console.log(data.scarList)
    const session = driver.session()
    const create = `create (:Character${str})`
    console.log(create)
    let results
    let existFlag = false
    // 检索人物是否存在
    await session
        .run(`MATCH (n:Character) RETURN n`)
        .then((r)=>{
            results = r.records
            // session.close()
            results.forEach((item,index)=>{
                console.log(index,item._fields[0].properties)
                if(
                    item._fields[0].properties.name === data.data.name &&
                    item._fields[0].properties.gender === data.data.gender &&
                    item._fields[0].properties.age === data.data.age &&
                    item._fields[0].properties.race === data.data.race &&
                    item._fields[0].properties.nation === data.data.nation &&
                    item._fields[0].properties.belief === data.data.belief
                )existFlag = true
            })
        })
        .catch((error)=>{
            results = error.message
            console.log(results)
        })
    // 等待1s
    // await new Promise(resolve => setTimeout(resolve, 1000))
    if(existFlag)return res.status(200).json({message:'该人物已存在'})
    // 创建人物
    await session
        .run(create)
        .then((r)=>{
            results = r.records
            // session.close()
            results.forEach((item,index)=>{
                console.log(index,item._fields[0].properties)
            })
        })
        .catch((error)=>{
            results = error.message
            console.log(results)
        })
    // 创建疤痕
    await data.scarList.forEach((item,index)=>{
        const session2 = driver.session()
        const cql_scar = `MATCH (n:Character) WHERE n.id=\'${id}\' CREATE (n)-[:scar]->(scar:Scar{bodyPart:\'${item.bodyPart}\',scarType:\'${item.scarType}\',scarShape:\'${item.scarShape}\'})`
        session2
            .run(cql_scar)
            .then(()=>{
                // session.close()
            })
            .catch((error)=>{
                results = error.message
                console.log(results)
            })
    })
    // 创建技能
    await data.skillList.forEach((item,index)=>{
        const session2 = driver.session()
        const cql_skill = `MATCH (n:Character) WHERE n.id=\'${id}\' CREATE (n)-[:skill]->(skill:Skill{name:\'${item.name}\',type:\'${item.type}\',proficiency:\'${item.proficiency}\'})`
        session2
            .run(cql_skill)
            .then(()=>{
                // session.close()
            })
            .catch((error)=>{
                results = error.message
                console.log(results)
            })
    })
    // 创建物品
    await data.belongingList.forEach((item,index)=>{
        const session2 = driver.session()
        const cql_belonging = `MATCH (n:Character) WHERE n.id=\'${id}\' CREATE (n)-[:belonging]->(belonging:belonging{name:\'${item.name}\',type:\'${item.type}\',proficiency:\'${item.state}\'})`
        session2
            .run(cql_belonging)
            .then(()=>{
                // session.close()
            })
            .catch((error)=>{
                results = error.message
                console.log(results)
            })
    })
    // 创建关系
    await data.relationList.forEach((item,index)=>{
        const session2 = driver.session()
        const cql_relation = `MATCH (n:Character) WHERE n.id=\'${id}\' MATCH (m:Character) WHERE m.id=\'${item.id}\' CREATE (n)-[:characterRelation{type:\'${item.relationType}\',relationship:\'${item.relationship}\'}]->(m)`
        session2
            .run(cql_relation)
            .then(()=>{
                session.close()
            })
            .catch((error)=>{
                results = error.message
                console.log(results)
            })
    })
    // session
    // .run(create)
    // .then((r)=>{
    //     results = r.records
    //     session.close()
    //     results.forEach((item,index)=>{
    //         console.log(index,item._fields[0].properties)
    //     })
    // })
    // .catch((error)=>{
    //     results = error.message
    //     console.log(results)
    // })

    return res.status(200).json({message:'成功创建人物',id:id})
    
    // if(code == undefined){
    //     return res.status(400).json({message:'Empty Code Found'})
    // }

    // try{
    //     const filePath = await generateFile(language,code)
    //     if(language === 'cpp' || language === 'c'){
    //         const output = await executeCPP(filePath)
    //         res.status(200).json({message:output})
    //     }
    //     else if(language === 'py'){
    //         const output =await executePY(filePath)
    //         res.status(200).json({message:output})
    //     }
    //     else{
    //         res.status(200).json({message:'Cannot identify language.'})
    //     }
        
    // }catch(error){
    //     return res.status(500).json({message:error})
    // }
})

app.get('/get',async (req,res)=>{
    const session = driver.session()
    let data = []
    let results
    await session
        .run(`MATCH (n:Character) RETURN n`)
        .then((r)=>{
            results = r.records
            session.close()
            results.forEach((item,index)=>{
                console.log(index,item._fields[0].properties)
                data.push(item)
            })
        })
        .catch((error)=>{
            results = error.message
            console.log(results)
        })
    return res.status(200).send(data)
})

app.get('/get/:id',async (req,res)=>{
    const session = driver.session()
    // console.log(req.params)
    const id = req.params.id
    let data
    let scarList = []
    let relationList = []
    let skillList = []
    let belongingList = []
    let results
    // 获取人物信息
    await session
        .run(`MATCH (n:Character) WHERE n.id=\'${id}\' RETURN n`)
        .then((r)=>{
            results = r.records
            results.forEach((item,index)=>{
                console.log(index,item._fields[0].properties)
                data = item
            })
        })
        .catch((error)=>{
            results = error.message
            console.log(results)
        })
    // 获取疤痕
    await session
        .run(`MATCH (n:Character)-[:scar]->(s) WHERE n.id=\'${id}\' RETURN s`)
        .then((r)=>{
            results = r.records
            // session.close()
            results.forEach((item,index)=>{
                console.log(index,item._fields[0].properties)
                scarList.push(item._fields[0].properties)
            })
        })
        .catch((error)=>{
            results = error.message
            console.log(results)
        })
    // 获取技能
    await session
        .run(`MATCH (n:Character)-[:skill]->(s) WHERE n.id=\'${id}\' RETURN s`)
        .then((r)=>{
            results = r.records
            // session.close()
            results.forEach((item,index)=>{
                console.log(index,item._fields[0].properties)
                skillList.push(item._fields[0].properties)
            })
        })
        .catch((error)=>{
            results = error.message
            console.log(results)
        })
    // 获取物品
    await session
        .run(`MATCH (n:Character)-[:belonging]->(s) WHERE n.id=\'${id}\' RETURN s`)
        .then((r)=>{
            results = r.records
            // session.close()
            results.forEach((item,index)=>{
                console.log(index,item._fields[0].properties)
                belongingList.push(item._fields[0].properties)
            })
        })
        .catch((error)=>{
            results = error.message
            console.log(results)
        })
    // 获取人物关系
    await session
        .run(`MATCH (n:Character)-[r:characterRelation]->(m) WHERE n.id=\'${id}\' RETURN r,m`)
        .then((r)=>{
            results = r.records
            session.close()
            results.forEach((item,index)=>{
                console.log(index,item._fields[0].properties)
                console.log(index,item._fields[1].properties)
                relationList.push({
                    relation:item._fields[0].properties,
                    details:item._fields[1].properties
                })
            })
        })
        .catch((error)=>{
            results = error.message
            console.log(results)
        })
    return res.status(200).send({
        data:data,
        scarList:scarList,
        skillList:skillList,
        belongingList:belongingList,
        relationList:relationList
    })
})

app.delete('/delete/:id',async (req,res)=>{
    const session = driver.session()
    console.log(req.params)
    const id = req.params.id
    let results
    // 检索人物是否存在
    let existFlag = false
    await session
        .run(`MATCH (n:Character) WHERE n.id=\'${id}\' RETURN n`)
        .then((r)=>{
            results = r.records
            // session.close()
            results.forEach((item,index)=>{
                console.log(index,item._fields[0].properties)
                if(item._fields[0].properties.id === id){
                    existFlag = true
                }
            })
        })
        .catch((error)=>{
            results = error.message
            console.log(results)
        })
    if(existFlag){
        console.log('人物存在')
        // 删除疤痕
        await session
            .run(`MATCH (n:Character)-[r:scar]->(s) WHERE n.id=\'${id}\' DELETE r,s`)
            // .then(()=>{
            //     session.close()
            // })
            .catch((error)=>{
                results = error.message
                console.log(results)
            })
        // 删除技能
        await session
            .run(`MATCH (n:Character)-[r:skill]->(s) WHERE n.id=\'${id}\' DELETE r,s`)
            // .then(()=>{
            //     session.close()
            // })
            .catch((error)=>{
                results = error.message
                console.log(results)
            })
        // 删除物品
        await session
            .run(`MATCH (n:Character)-[r:belonging]->(s) WHERE n.id=\'${id}\' DELETE r,s`)
            // .then(()=>{
            //     session.close()
            // })
            .catch((error)=>{
                results = error.message
                console.log(results)
            })
        // // 删除人物关系
        // await session
        //     .run(`MATCH (n:Character)-[r]->() WHERE n.id=\'${id}\' DELETE r`)
        //     // .then(()=>{
        //     //     session.close()
        //     // })
        //     .catch((error)=>{
        //         results = error.message
        //         console.log(results)
        //     })
        // 删除人物
        await session
            .run(`MATCH (n:Character) WHERE n.id=\'${id}\' DETACH DELETE n`)
            .then(()=>{
                session.close()
            })
            .catch((error)=>{
                results = error.message
                console.log(results)
            })
    }else{
        return res.status(200).send({message:'该人物不存在'})
    }
    return res.status(200).send({message:'删除成功'})
})

app.get('/query',async (req,res)=>{
    const key = req.query.key
    const session = driver.session()
    let data = []
    let results
    await session
        .run(`MATCH (n:Character) WHERE n.name Contains \'${key}\' RETURN n LIMIT 10`)
        .then((r)=>{
            results = r.records
            session.close()
            results.forEach((item,index)=>{
                console.log(index,item._fields[0].properties)
                data.push(item._fields[0].properties)
            })
        })
        .catch((error)=>{
            results = error.message
            console.log(results)
        })
    return res.status(200).send(data)
})

app.post('/revise/:id',async (req,res)=>{
    const session = driver.session()
    const data = req.body
    // 删除旧数据
    const id = req.params.id
    console.log(req.params)
    let results
    // 检索人物是否存在
    let existFlag = false
    await session
        .run(`MATCH (n:Character) WHERE n.id=\'${id}\' RETURN n`)
        .then((r)=>{
            results = r.records
            // session.close()
            results.forEach((item,index)=>{
                console.log(index,item._fields[0].properties)
                if(item._fields[0].properties.id === id){
                    existFlag = true
                }
            })
        })
        .catch((error)=>{
            results = error.message
            console.log(results)
        })
    if(existFlag){
        console.log('人物存在')
        // 删除疤痕
        await session
            .run(`MATCH (n:Character)-[r:scar]->(s) WHERE n.id=\'${id}\' DELETE r,s`)
            // .then(()=>{
            //     session.close()
            // })
            .catch((error)=>{
                results = error.message
                console.log(results)
            })
        // 删除技能
        await session
            .run(`MATCH (n:Character)-[r:skill]->(s) WHERE n.id=\'${id}\' DELETE r,s`)
            // .then(()=>{
            //     session.close()
            // })
            .catch((error)=>{
                results = error.message
                console.log(results)
            })
        // 删除物品
        await session
            .run(`MATCH (n:Character)-[r:belonging]->(s) WHERE n.id=\'${id}\' DELETE r,s`)
            // .then(()=>{
            //     session.close()
            // })
            .catch((error)=>{
                results = error.message
                console.log(results)
            })
        // 删除人物关系
        await session
            .run(`MATCH (n:Character)-[r]->() WHERE n.id=\'${id}\' DELETE r`)
            .catch((error)=>{
                results = error.message
                console.log(results)
            })
        // // 删除人物
        // await session
        //     .run(`MATCH (n:Character) WHERE n.id=\'${id}\' DETACH DELETE n`)
        //     // .then(()=>{
        //     //     session.close()
        //     // })
        //     .catch((error)=>{
            //         results = error.message
            //         console.log(results)
            //     })
        }else{
            return res.status(200).send({message:'该人物不存在'})
        }
    // 创建人物
    let cql_revise = `MATCH (n:Character) WHERE n.id=\'${id}\' SET `
    for(let key in data.data){
		let element = data.data[key]
        if(typeof(element) === 'string')
            cql_revise += key + "=\'" + element + "\',";
        else
            cql_revise += key + "=" + element + ",";
	}
    cql_revise = cql_revise.substring(0,cql_revise.length-1)
    console.log(data.data)
    console.log(data.scarList)
    await session
        .run(cql_revise)
        .then((r)=>{
            results = r.records
            // session.close()
            results.forEach((item,index)=>{
                console.log(index,item._fields[0].properties)
            })
        })
        .catch((error)=>{
            results = error.message
            console.log(results)
        })
    // 创建疤痕
    await data.scarList.forEach((item,index)=>{
        const session2 = driver.session()
        const cql_scar = `MATCH (n:Character) WHERE n.id=\'${id}\' CREATE (n)-[:scar]->(scar:Scar{bodyPart:\'${item.bodyPart}\',scarType:\'${item.scarType}\',scarShape:\'${item.scarShape}\'})`
        session2
            .run(cql_scar)
            .then(()=>{
                // session.close()
            })
            .catch((error)=>{
                results = error.message
                console.log(results)
            })
    })
    // 创建技能
    await data.skillList.forEach((item,index)=>{
        const session2 = driver.session()
        const cql_skill = `MATCH (n:Character) WHERE n.id=\'${id}\' CREATE (n)-[:skill]->(skill:Skill{name:\'${item.name}\',type:\'${item.type}\',proficiency:\'${item.proficiency}\'})`
        session2
            .run(cql_skill)
            .then(()=>{
                // session.close()
            })
            .catch((error)=>{
                results = error.message
                console.log(results)
            })
    })
    // 创建物品
    await data.belongingList.forEach((item,index)=>{
        const session2 = driver.session()
        const cql_belonging = `MATCH (n:Character) WHERE n.id=\'${id}\' CREATE (n)-[:belonging]->(belonging:belonging{name:\'${item.name}\',type:\'${item.type}\',proficiency:\'${item.state}\'})`
        session2
            .run(cql_belonging)
            .then(()=>{
                // session.close()
            })
            .catch((error)=>{
                results = error.message
                console.log(results)
            })
    })
    // 创建关系
    await data.relationList.forEach((item,index)=>{
        const session2 = driver.session()
        const cql_relation = `MATCH (n:Character) WHERE n.id=\'${id}\' MATCH (m:Character) WHERE m.id=\'${item.id}\' CREATE (n)-[:characterRelation{type:\'${item.relationType}\',relationship:\'${item.relationship}\'}]->(m)`
        session2
            .run(cql_relation)
            .then(()=>{
                session.close()
            })
            .catch((error)=>{
                results = error.message
                console.log(results)
            })
    })
    return res.status(200).json({message:'成功创建人物',id:id})
})