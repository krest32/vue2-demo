<template>
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <!-- 加入栅格系统 gutter代表栅格系统之间的间隔 -->
        <el-row :gutter="20">
            <el-col :span="4">
                <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
            </el-col>
        </el-row>

        <!-- 表格区域  -->
        <el-table :data="rolelist" style="width: 100%" border stripe>
            <el-table-column type="expand" label="展开列" width="100px">
                <template slot-scope="scope">
                    <!-- pre 直接可以json的格式显示数据 -->
                    <!-- <pre>
                        {{scope.row}}
                    </pre> -->
                    <el-row :class="['venter','bdbottom',i1===0 ? 'bdtop':'']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                        <!-- 渲染一級权限 -->
                        <el-col :span="5">
                            <el-tag closable @close="removeRightById(scope.row,item1.id)"> {{item1.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>

                        <!-- 渲染二级和三級权限 -->
                        <el-col :span="19">
                            <!-- class 渲染列表的一種格式 -->
                            <el-row :class="[i2 === 0 ? '':'bdtop','venter']" v-for="(item2, i2) in item1.children" :key="item2.id">

                                <el-col :span="6">
                                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>

                                <!-- 渲染三級權限 -->
                                <el-col :span="18">
                                    <el-tag v-for="(item3, i3) in item2.children" :key="item3.id" type="danger" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                </el-col>

                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="100px" align="center" />
            <el-table-column prop="roleName" label="角色名称" align="center" />
            <el-table-column prop="roleDesc" label="角色描述" align="center" />
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size='mini' @click="showEditDialog(scope.row.id)" />
                    <el-button type="danger" icon="el-icon-delete" size='mini' @click="removeDataById(scope.row,item3.id)" />
                    <el-tooltip class="item" effect="dark" content="分配权限" placement="top">
                        <el-button type="warning" icon="el-icon-setting" size='mini' @click="showSetRightDialog(scope.row)" />
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">

        <!-- 树形插件 -->
        <el-tree :data="rightlist" ref="treeRef" :props="treeProps" show-checkbox node-key="id" :default-checked-keys="defKeys" default-expand-all></el-tree>

        <!-- 对话框按钮区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button>取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>

    </el-dialog>

</div>
</template>

<script>
export default {
    data() {
        return {
            roleId: '',
            rolelist: [],
            setRightDialogVisible: false,
            rightlist: [],
            treeProps: {
                label: 'authName',
                children: 'children',
            },
            // 树形差价默认的选中项
            defKeys: []

        }
    },
    created() {
        this.getRolesList();
    },
    methods: {

        async allotRights() {
            const keys = [
                // 获取全选中的节点的keys
                ...this.$refs.treeRef.getCheckedKeys(),
                // 获取半选中的节点的keys
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            console.log(keys)

            // 将数组调整成为一个以逗号间隔的字符串
            const idStr = keys.join(',')

            const {data:res} =  await this.$http.post(`roles/${this.roleId}/rights`, {
                rids: idStr
            })

            if(res.meta.status !==200) return this.$message.error(res.meta.msg)

            this.$message.success(res.meta.msg)
            this.getRolesList()
            this.setRightDialogVisible = false

        },

        // 处理关闭树形插件对话框
        setRightDialogClosed() {
            this.defKeys = []
        },

        // 显示修改权限对话框
        async showSetRightDialog(role) {

            this.roleId = role.id
            // 获取所有的权限数据
            const {
                data: res
            } = await this.$http.get('rights/tree')
            if (res.meta.status !== 200) return this.$message.error("获取所有权限列表失败")
            // 获取得到的全县数据           
            this.rightlist = res.data

            this.getLeafKeys(role, this.defKeys)

            // console.log(this.rightlist)
            this.setRightDialogVisible = true;
        },

        // 获取所有的defKeys
        getLeafKeys(node, arr) {
            // 如果当前的node戒掉不包含三级节点
            if (!node.children) {
                return arr.push(node.id)
            }
            // 递归获取虽有的选中id
            node.children.forEach(element => {
                this.getLeafKeys(element, arr)
            });
        },

        // 根據id刪除權限
        async removeRightById(role, rightId) {
            //弹窗提示用户是否要删除
            const confirmResult = await this.$confirm('请问是否要删除该权限', '删除提示', {
                confirmButtonText: '确认删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            //如果用户点击确认，则confirmResult 为'confirm'
            //如果用户点击取消, 则confirmResult获取的就是catch的错误消息'cancel'
            if (confirmResult != "confirm") {
                return this.$message.info("已经取消删除")
            }

            //用户点击了确定表示真的要删除
            //当发送delete请求之后，返回的数据就是最新的角色权限信息
            const {
                data: res
            } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if (res.meta.status !== 200)
                return this.$message.error('删除角色权限失败')

            //无需再重新加载所有权限
            //只需要对现有的角色权限进行更新即可,也就是刪除删除数据后，接口自动返回了数据
            role.children = res.data
            // this.getRoleList();
        },

        async getRolesList() {
            const {
                data: res
            } = await this.$http.get('roles')
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            this.rolelist = res.data
            console.log(this.rolelist)
        }
    }
}
</script>

<style lang="less" scoped>
.el-tag {
    margin: 7px;
}

.bdtop {
    border-top: 1px solid #eee;
}

.bdbottom {
    border-bottom: 1px solid #eee;
}
</style>
