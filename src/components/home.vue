<template>
<el-container class="home-contianer">
    <!-- 头部菜单 -->
    <el-header>
        <div>
            <img src="../assets/heima.png" alt="">
            <span>后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>

    <!-- 内容区域 -->
    <el-container>

        <!-- 侧边菜单-->
        <el-aside :width="iscollapse ?'64px':'200px'">
            <div class="toggle-button" @click="toggleCollapse">|||</div>

            <!-- 侧边菜单项
            :unique-opened 每次展开一个菜单
            active-text-color选中的颜色 
            :router 开启路由模式，点击菜单后，跳转到对应的item.id页面-->
            <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" :unique-opened="true" :collapse="iscollapse" :collapse-transition="false" :router="true" :default-active="activePath">

                <!-- 一级菜单 -->
                <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
                    <!-- 一级菜单的区域 -->
                    <template slot="title">
                        <!-- 图标 -->
                        <i :class="iconsObj[item.id]"></i>
                        <span>{{item.authName}}</span>
                    </template>

                    <!-- 二级菜单 -->
                    <!-- index 路由跳转的地址属性 -->
                    <el-menu-item @click="saveNavState('/'+subItem.path)" :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
                        <!-- 图标 -->
                        <i class="el-icon-menu"></i>
                        <span>{{subItem.authName}}</span>
                    </el-menu-item>
                </el-submenu>

            </el-menu>
        </el-aside>

        <!-- 内容菜单 -->
        <el-main>
            <!-- 进入home页面中，然后在main区域：展示welcome页面 -->
            <router-view></router-view>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
    data() {
        return {
            menulist: [],
            iconsObj: {
                '125': 'iconfont icon-user',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
                '145': 'iconfont icon-baobiao'
            },
            iscollapse: false,
            activePath: ''

        }
    },
    created() {
        this.getMenuList();
        this.activePath = window.sessionStorage.getItem('avtivePath')
    },

    methods: {

        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath', activePath);
            this.activePath=activePath
        },

        // 点击按钮，切换菜单的折叠和展开
        toggleCollapse() {
            this.iscollapse = !this.iscollapse
        },

        // 获取所有的菜单
        async getMenuList() {
            // 得到菜单的请求数据
            const {
                data: res
            } = await this.$http.get('menus')
            // 打印菜单数据
            console.log(res)
            // 判断获取得到的信息
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.menulist = res.data
            console.log(this.menulist)
        },

        // 退出功能
        logout() {
            window.sessionStorage.clear();
            this.$router.push('/login')
        }
    }

}
</script>

<style lang="less" scoped>
.toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    // 行高
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}

.home-contianer {
    height: 100%;
}

.el-header {
    background-color: #373D41;
    // 左右贴着边对齐
    display: flex;
    justify-content: space-between;

    // 清楚左侧的padding空间
    padding-left: 0%;
    // 按钮居中
    align-items: center;

    color: #ffff;
    font-size: 20px;

    >div {
        display: flex;
        align-items: center;
        margin-left: 15px;
    }
}

.el-aside {
    background-color: #333744;

    // 优化边框线对不齐的情况
    .el-menu {
        border-right: none;
    }
}

.el-main {
    background-color: #eaedf1;
}

.iconfont {
    margin-right: 10px;
}
</style>
