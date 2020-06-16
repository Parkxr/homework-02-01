#!/usr/bin/env node
const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
inquirer.prompt([
    {
        type: 'input',
        name: 'appName',
        message: 'Please enter your app name.',
        default: 'my-app'
    },
    {
        type: 'input',
        name: 'description',
        message: 'Please describe your app.',
    }
]).then(answers =>{
    const tempDir = path.join(__dirname,'templates')
    const targetDir = process.cwd()
    fs.readdir(tempDir,(err,files) =>{
        if (err) throw err
        files.forEach(item =>{
            ejs.renderFile(path.join(tempDir,item),answers,(err,result)=>{
                if (err) throw err
                fs.writeFileSync(path.join(targetDir,item),result)
            })
        })
    })
})