# 客户端工具

用于ios和android打包, 热更包生成

#### 项目初始化
在目录里执行`python init.py`

#### 项目打包
`python build.py ios` 或 `python build.py android`

#### 制作更新包
修改`project.conf`里的`new_version`

在目录里执行`python generate_update.py`

#### 配置文件project.conf
`init.py`执行之后会生成project.conf文件,如果没有请参照上一条

###### project.conf结构

1.android 
    
    android打包相关参数配置

2.ios

    资源目录设置
        'target': 打包目标debug_key 
        'debug':  签名release_key
        'release': 签名
    

3.resource

    资源目录设置
        'res_path': res目录位置
        'resources_path': resources目录位置
        'shield_file_list': 热更时压缩忽略文件名

4.secret
    
    加密文件位置
        'h_file_path': 本地Area.h
        'h_dist_file_path': 目标Area.h

5.ccs
    
    CocosStudio项目文件名称
        'ccs_name': 文件名称

6.update

    热更新相关配置
        'publish_path': 发布位置
        'base_package_path': 基础包所在位置
        'update_path': 热更包生成位置
        'temp_path': 临时包位置
        'base_version': 基础版本号列表
        'new_version': 新版本号列表
        'manifest_list_base_version': 对应基础版本的manifest文件列表
        'update_url': 更新地址(域名)
        'shield_file_list': 热更忽略文件

###### Area.h结构
    
    'COMPANY': 掩码
    'FOLDER': nginx目录
    'AccessKey': bundleID最后一段
    'AccessKeySecret': 随机汉字词生成16位md5
