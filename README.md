#  Dckr  (Docker+ Compose+Kubernets+Rancher)

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

## 项目结构

```
.
├── public                                      // 静态资源文件
│   ├── favicon.jpg                             // 项目图标
│   ├── index.html                              // 项目html入口文件
├── config                                      // 项目打包路径
├── elm                                         // 上线项目文件，放在服务器即可正常访问
├── screenshots                                 // 项目截图
├── src                                         // 源码目录
│   ├── components                              // 组件
│   │   ├── DockerCompose                       // Compose模块组件
│   │   │   ├── Step1.vue                    	// 步骤一
│   │   │   ├── Step2.vue                    	// 步骤二
│   │   │   ├── Step3.vue                    	// 步骤三
│   │   │   ├── Step4.vue                    	// 步骤四
│   │   ├── Dockerfile                          // Docker模块组件
│   │   │   ├── Step1.vue                    	// 步骤一
│   │   │   ├── Step2.vue                    	// 步骤二
│   │   │   ├── Step3.vue                    	// 步骤三
│   │   │   ├── Step4.vue                    	// 步骤四
│   │   │   ├── Step5.vue                    	// 步骤五
│   │   ├── Kubernetes                          // Kubernetes模块组件
│   │   │   ├── common                   		// Kubernetes模块最基础组件
│   │   │   |	├── Base.vue                    // 填写基础信息组件
│   │   │   |	├── Container.vue               // 填写容器配置组件
│   │   │   |	├── Other.vue                   // 填写其他信息组件
│   │   │   |	├── Volume.vue                  // 填写磁盘挂载信息组件
│   │   │   ├── template                   		// 在common基础上抽象一层的组件
│   │   │   |	├── OtherTemplate.vue           // Deployment和ReplicaSet组件的OtherTemplate模板组件
│   │   │   |	├── PodTemplate.vue             // Deployment和ReplicaSet组件的PodTemplate模板组件
│   │   │   ├── ConfigMap.vue                   // ConfigMap模板组件
│   │   │   ├── Deployment.vue                  // Deployment模板组件
│   │   │   ├── Pod.vue                    		// Pod模板组件
│   │   │   ├── ReplicaSet.vue                  // ReplicaSet模板组件
│   │   │   ├── Secret.vue                    	// Secret模板组件
│   │   │   ├── Sevice.vue                    	// Service模板组件
│   │   ├── common                              // 公共组件
│   │   │   ├── alertTip.vue                    // 弹出框组件
│   │   │   ├── buyCart.vue                     // 购物车组件
│   │   │   ├── computeTime.vue                 // 倒计时组件
│   │   │   ├── loading.vue                     // 页面初始化加载数据的动画组件
│   │   │   ├── mixin.js                        // 组件混合(包括：指令-下拉加载更多，处理图片地址)
│   │   │   ├── ratingStar.vue                  // 评论的五颗星组件
│   │   │   └── shoplist.vue                    // msite和shop页面的餐馆列表公共组件
│   │   ├── footer
│   │   │   └── footGuide.vue                   // 底部公共组件
│   │   └── header
│   │       └── head.vue                        // 头部公共组件
│   ├── config                                  // 基本配置
│   │   ├── env.js                              // 环境切换配置
│   │   ├── fetch.js                            // 获取数据
│   │   ├── mUtils.js                           // 常用的js方法
│   │   └── rem.js                              // px转换rem
│   ├── images                                  // 公共图片
│   ├── page
│   │   ├── balance
│   │   │   ├── balance.vue                     // 余额页
│   │   │   └── children
│   │   │       └── detail.vue                  // 余额说明
│   │   ├── benefit
│   │   │   ├── benefit.vue                     // 红包页
│   │   │   └── children
│   │   │       ├── commend.vue                 // 推荐有奖
│   │   │       ├── coupon.vue                  // 代金券说明
│   │   │       ├── exchange.vue                // 兑换红包
│   │   │       ├── hbDescription.vue           // 红包说明
│   │   │       └── hbHistory.vue               // 历史红包
│   │   ├── city
│   │   │   └── city.vue                        // 当前城市页
│   │   ├── confirmOrder
│   │   │   ├── children
│   │   │   │   ├── children
│   │   │   │   │   ├── addAddress.vue          // 添加地址页
│   │   │   │   │   └── children
│   │   │   │   │       └── searchAddress.vue   // 搜索地址页
│   │   │   │   ├── chooseAddress.vue           // 选择地址页
│   │   │   │   ├── invoice.vue                 // 选择发票页
│   │   │   │   ├── payment.vue                 // 付款页
│   │   │   │   ├── remark.vue                  // 订单备注页
│   │   │   │   └── userValidation.vue          // 用户验证页
│   │   │   └── confirmOrder.vue                // 确认订单页
│   │   ├── download
│   │   │   └── download.vue                    // 下载App
│   │   ├── find
│   │   │   └── find.vue                        // 发现页
│   │   ├── food
│   │   │   └── food.vue                        // 食品筛选排序页
│   │   ├── forget
│   │   │   └── forget.vue                      // 忘记密码，修改密码页
│   │   ├── home
│   │   │   └── home.vue                        // 首页
│   │   ├── login
│   │   │   └── login.vue                       // 登录注册页
│   │   ├── msite
│   │   │   └── msite.vue                       // 商铺列表页
│   │   ├── order
│   │   │   ├── children
│   │   │   │   └── orderDetail.vue             // 订单详情页
│   │   │   └── order.vue                       // 订单列表页
│   │   ├── points
│   │   │   ├── children
│   │   │   │   └── detail.vue                  // 积分说明
│   │   │   └── points.vue                      // 积分页
│   │   ├── profile
│   │   │   ├── children
│   │   │   │   ├── children
│   │   │   │   │   ├── address.vue             // 地址
│   │   │   │   │   └── children
│   │   │   │   │       ├── add.vue             // 新增地址
│   │   │   │   │       └── children
│   │   │   │   │           └── addDetail.vue   // 搜索地址
│   │   │   │   ├── info.vue                    // 帐户信息
│   │   │   │   └── setusername.vue             // 重置用户名
│   │   │   └── profile.vue                     // 个人中心
│   │   ├── search
│   │   │   └── search.vue                      // 搜索页
│   │   ├── service
│   │   │   ├── children
│   │   │   │   └── questionDetail.vue          // 问题详情
│   │   │   └── service.vue                     // 服务中心
│   │   ├── shop
│   │   │   ├── children
│   │   │   │   ├── children
│   │   │   │   │   └── shopSafe.vue            // 商铺认证信息页
│   │   │   │   ├── foodDetail.vue              // 商铺信息页
│   │   │   │   └── shopDetail.vue              // 单个商铺信息页
│   │   │   └── shop.vue                        // 商铺筛选页
│   │   └── vipcard
│   │       ├── children
│   │       │   ├── invoiceRecord.vue           // 购买记录
│   │       │   ├── useCart.vue                 // 使用卡号购买
│   │       │   └── vipDescription.vue          // 会员说明
│   │       └── vipcard.vue                     // 会员卡办理页
│   ├── plugins                                 // 引用的插件
│   ├── router
│   │   └── router.js                           // 路由配置
│   ├── service                                 // 数据交互统一调配
│   │   ├── getData.js                          // 获取数据的统一调配文件，对接口进行统一管理
│   │   └── tempdata                            // 开发阶段的临时数据
│   ├── store                                   // vuex的状态管理
│   │   ├── action.js                           // 配置actions
│   │   ├── getters.js                          // 配置getters
│   │   ├── index.js                            // 引用vuex，创建store
│   │   ├── modules                             // store模块
│   │   ├── mutation-types.js                   // 定义常量muations名
│   │   └── mutations.js                        // 配置mutations
│   └── style
│       ├── common.scss                         // 公共样式文件
│       ├── mixin.scss                          // 样式配置文件
│       └── swiper.min.css
│   ├── App.vue                                 // 页面入口文件
│   ├── main.js                                 // 程序入口文件，加载各种公共组件
├── favicon.ico                                 // 图标
├── index.html                                  // 入口html文件
.

56 directories, 203 files

```



