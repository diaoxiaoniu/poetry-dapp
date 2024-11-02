#!/bin/bash

# 安装依赖
npm install

# 编译合约
npx hardhat compile

# 复制 artifacts
npm run copy-artifacts

# 启动应用
npm start 