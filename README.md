#  Dckr  (Docker+ Compose+Kubernets+Rancher)

![](https://img.shields.io/badge/build-passing-brightgreen)![](https://img.shields.io/badge/Vue-reference-blue)![](https://img.shields.io/badge/license-MPL--2.0-orange)

 `Dckr` 是一款基于Docker的容器配置及编排的向导式构建工具。（支持Docker、Compose、Kubernets、Rancher的资源文件向导式构建）

**通过它，你可以轻松完成以下操作：**

- 借助语义化UI向导式构建Dockerfile、docker-compose.yaml、Kubernetes资源文件、Rancher Chart。
- 支持docker-compose.yaml向Kubernetes资源文件的转换。
- 支持docker-compose.yaml或Kubernetest（Helm Chart）向Rancher Chart的转换。

**它的存在意义：**

- 通过语义化UI向导式的指引你去构建相关容器配置、编排文件，降低了你的学习成本。
- 通过转换功能，能轻松地将不同容器产品的配置文件进行相互转换，极大地提高了你的工作效率。
- 通过它进行构建的YAML文件是符合规范的，让你摆脱编写YAML文件因缩进等格式问题带来的痛苦。
- 通过它你可以轻松对相关配置项进行更改，然后点击构建按钮，编辑器内容也会相应变化；可用于辅助容器相关教学。
- 它的实现方案，能为诸如："通过语义化UI实现配置文件的生成"等各种需求，提供一定的思路甚至是一种解决方案。

## 快速开始

### 本地运行

```
git https://github.com/LGSKOKO/Dckr.git

cd Dckr

npm install 

npm run serve

```

### 服务器部署

### 容器部署

### 关于数据接口

该项目的Kubernetes模块部分功能 和 Rancher模块全部功能 需要后端的协助，[后台项目传送地址](https://github.com/LGSKOKO/Dckr_Service)，:airplane: 。

## 项目结构

```
.
├── public                                      // 静态资源文件
│   ├── favicon.jpg                             // 项目图标
│   └── index.html                              // 项目html入口文件
├── screenshots                                 // 项目截图
├── src                                         // 源码目录
│   ├── components                              // 组件
│   │   ├── DockerCompose                       // Compose模块组件
│   │   │   ├── Step1.vue                    	
│   │   │   ├── Step2.vue                    	
│   │   │   ├── Step3.vue                    	
│   │   │   ├── Step4.vue                    	
│   │   ├── Dockerfile                          // Docker模块组件
│   │   │   ├── Step1.vue                    	
│   │   │   ├── Step2.vue                    	
│   │   │   ├── Step3.vue                    	
│   │   │   ├── Step4.vue                    	
│   │   │   ├── Step5.vue                    	
│   │   ├── Kubernetes                          // Kubernetes模块组件
│   │   │   ├── common                   		// Kubernetes模块最基础组件
│   │   │   |	├── Base.vue                    // 填写基础信息组件
│   │   │   |	├── Container.vue               // 填写容器配置组件
│   │   │   |	├── Other.vue                   // 填写其他信息组件
│   │   │   |	└── Volume.vue                  // 填写磁盘挂载信息组件
│   │   │   ├── template                   		// 在common基础上抽象一层的组件
│   │   │   |	├── OtherTemplate.vue           // Deployment和ReplicaSet组件的OtherTemplate模板组件
│   │   │   |	└── PodTemplate.vue             // Deployment和ReplicaSet组件的PodTemplate模板组件
│   │   │   ├── ConfigMap.vue                   // ConfigMap模板组件
│   │   │   ├── Deployment.vue                  // Deployment模板组件
│   │   │   ├── Pod.vue                    		// Pod模板组件
│   │   │   ├── ReplicaSet.vue                  // ReplicaSet模板组件
│   │   │   ├── Secret.vue                    	// Secret模板组件
│   │   │   └── Sevice.vue                    	// Service模板组件
│   │   ├── Editor.vue                          // 编辑器公共组件
│   │   ├── Header.vue						  // 头部公共组件
│   │   └── Sider.vue						  // 侧边栏公共组件
│   ├── router
│   │   └── index.js                           	// 路由配置
│   ├── store								
│   │   └── index.js                           	// Vuex配置
│   ├── view                                  	
│   │   ├── CreateDockerCompose.vue             // Compose模块页面
│   │   ├── CreateDockerfile.vue                // Docker模块页面
│   │   ├── CreateKubernetes.vue                // Kubernetes模块页面
│   │   ├── CreateRancher.vue                   // Racnher模块页面
│   │   └── Home.vue                   		   // 主页面
│   ├── App.vue                                // 页面入口文件
│   ├── commonUtil.js                          // 自定义工具文件
│   ├── main.js                                // 程序入口文件，加载各种公共组件
│   └── request.vue                            // 自定义项目请求文件
└──

```



## 部分运行截图

### 向导式构建平台首页

- ![Image](https://raw.github.com/LGSKOKO/Dckr/main/screenshot/向导式构建平台首页.png)

### Docker模块

- ![Image](https://raw.github.com/LGSKOKO/Dckr/main/screenshot/Docker/1.png)
- ![Image](https://raw.github.com/LGSKOKO/Dckr/main/screenshot/Docker/2.png)
- ![Image](https://raw.github.com/LGSKOKO/Dckr/main/screenshot/Docker/3.png)
- ![Image](https://raw.github.com/LGSKOKO/Dckr/main/screenshot/Docker/4.png)
- ![Image](https://raw.github.com/LGSKOKO/Dckr/main/screenshot/Docker/5.png)
- ![Image](https://raw.github.com/LGSKOKO/Dckr/main/screenshot/Docker/6.png)

### Compose模块

- ![Image](https://raw.github.com/LGSKOKO/Dckr/main/screenshot/Compose/1.png)
- ![Image](https://raw.github.com/LGSKOKO/Dckr/main/screenshot/Compose/2.png)
- ![Image](https://raw.github.com/LGSKOKO/Dckr/main/screenshot/Compose/3.png)
- ![Image](https://raw.github.com/LGSKOKO/Dckr/main/screenshot/Compose/4.png)
- ![Image](https://raw.github.com/LGSKOKO/Dckr/main/screenshot/Compose/5.png)
- ![Image](https://raw.github.com/LGSKOKO/Dckr/main/screenshot/Compose/6.png)
- ![Image](https://raw.github.com/LGSKOKO/Dckr/main/screenshot/Compose/7.png)

### Kubernetes模块
**基于Compose向导式构建**

- ![Image](https://raw.github.com/LGSKOKO/Dckr/main/screenshot/Kubernetes/1.png)

**向导式构建**

- ![Image](https://raw.github.com/LGSKOKO/Dckr/main/screenshot/Kubernetes/2.png)
- ![Image](https://raw.github.com/LGSKOKO/Dckr/main/screenshot/Kubernetes/3.png)
- ![Image](https://raw.github.com/LGSKOKO/Dckr/main/screenshot/Kubernetes/4.png)
- ![Image](https://raw.github.com/LGSKOKO/Dckr/main/screenshot/Kubernetes/5.png)
- ![Image](https://raw.github.com/LGSKOKO/Dckr/main/screenshot/Kubernetes/6.png)
- ![Image](https://raw.github.com/LGSKOKO/Dckr/main/screenshot/Kubernetes/7.png)

### Rancher模块

- ![Image](https://raw.github.com/LGSKOKO/Dckr/main/screenshot/Rancher/1.png)
- ![Image](https://raw.github.com/LGSKOKO/Dckr/main/screenshot/Rancher/2.png)
- ![Image](https://raw.github.com/LGSKOKO/Dckr/main/screenshot/Rancher/3.png)

