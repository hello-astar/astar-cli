#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const colors = require('colors');

const args = process.argv.slice(2);
if (args.length < 2) {
  console.warn('请输入完整参数'.red);
  return;
}
const from = args[0];
const to = args[1];

const changeFile = (filepath) => {
  fs.readdir(filepath, function (err, files) {
    if (err) console.warn(err);
    else {
      files.forEach(filename => {
        let fileDir = path.join(filepath, filename);
        fs.stat(fileDir, function (error, stats) {
          if (error) console.warn(error);
          else {
            if (stats.isFile() && (new RegExp(/.*\.(js|vue)$/)).test(fileDir)) {
              let regExp = new RegExp("(@Author|@LastEditors|@author)(: | )" + from, "g");
              // 读取文件内容
              let content = fs.readFileSync(fileDir, 'utf-8');
              if (regExp.test(content)) {
                console.log("成功修改：", fileDir.green);
                fs.writeFileSync(fileDir, content.replace(regExp, "$1$2" + to));
              }
              // // 修改文件内容
            } else if (stats.isDirectory() && !(new RegExp("node_modules", "g")).test(fileDir)) {
              changeFile(fileDir);
            }
          }
        })
      })
    }
  })
}

changeFile(path.join(process.cwd()));
