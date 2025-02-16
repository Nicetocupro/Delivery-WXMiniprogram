# Delivery-WXMiniprogram

## 说明

​	本仓库是微信小程序客户端的上游仓库，马恒超作为Maintainer。

## 项目启动说明

​	本项目也使用了npm进行附件包的下载，需要在小程序内进行项目配置。

### project.config.json

​	在本地需要进行`project.config.json`的修改，最重要的是修改`packNpmManually`和`packNpmRelationList`的内容，以下是我本地`project.config.json`的内容

```json
{
  "compileType": "miniprogram",
  "libVersion": "trial",
  "packOptions": {
    "ignore": [],
    "include": []
  },
  "setting": {
    "coverView": true,
    "es6": true,
    "postcss": true,
    "minified": true,
    "enhance": true,
    "showShadowRootInWxmlPanel": true,
    "packNpmManually": true,
    "packNpmRelationList": [
      {
        "packageJsonPath": "./package.json",
        "miniprogramNpmDistDir": "./"
      }
    ],
    "babelSetting": {
      "ignore": [],
      "disablePlugins": [],
      "outputPath": ""
    }
  },
  "condition": {},
  "editorSetting": {
    "tabIndent": "auto",
    "tabSize": 2
  },
  "appid": "这里是你自己的appid"
}
```

###  npm  install

```cmd
npm install
```

​	第一次使用Npm包的时候，都需要先npm install将package.json的内容，先下载到本地中。

### 构建 npm 包

​	打开微信开发者工具，点击 工具 -> 构建 npm，并勾选 使用 npm 模块 选项，可见官方文档 快速上手 的 步骤四。新版的微信开发者工具中，详情 -> 本地设置中没有【使用 npm 模块】选项，则不用理会, 如果有则需要勾选。

### 关闭http检查

​	打开微信开发者工具，点击右上角 详情 ->本地设置 -> 不校验合法域名、web-view、tls版本以及HTTP证书，将该选项✔

​	后续的步骤和原先一样，没什么区别

## 项目前端进度

```
根目录
├─.gitlab
│  ├─issue_templates
│  └─merge_request_templates
├─asserts
│  └─images
│      ├─comments
│      ├─index
│      ├─mapMark
│      ├─order
│      ├─profile
│      ├─register
│      ├─rider_map
│      ├─shopTest
│      ├─starbox
│      └─takeaway
├─components
│  ├─plugins
│  └─templates
├─config
├─miniprogram_npm
│  └─@vant
├─node_modules
│  └─@vant
├─pages
│  ├─addAddress
│  ├─complaintFeedback
│  ├─cooperation
│  ├─index
│  ├─manageAddress
│  ├─map
│  ├─modifyInformation
│  ├─order
│  ├─order_info
│  ├─profile
│  ├─register
│  ├─rider_identify
│  ├─rider_map
│  ├─rider_order
│  ├─rider_profile
│  ├─shop
│  ├─shoppingCart
│  ├─takeaway
│  └─writeReview
├─request
│  └─module
└─utils
```

## 附言

目前本项目、课程已经完结，本项目由小程序、中台、后端三个部分组成，这里给出三个仓库的位置供大家参考校园外卖app的实现方法：

- 微信小程序：https://github.com/Nicetocupro/Delivery-WXMiniprogram
- 中台：https://github.com/Nicetocupro/Delivery-AdminPanel
- 后端：https://github.com/PHANTOM-2004/delivery-backend
