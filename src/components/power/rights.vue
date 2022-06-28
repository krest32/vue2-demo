<template>
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <el-table :data="rightlist" style="width: 100%" border stripe>
            <el-table-column type="index" label="#" align="center" />
            <el-table-column prop="authName" label="权限名称" align="center" />
            <el-table-column prop="path" label="路径" align="center" />
            <el-table-column prop="level" label="权限等级" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level === '0' ">一级</el-tag>
                    <el-tag v-if="scope.row.level === '1' " type="sucess">二级</el-tag>
                    <el-tag v-if="scope.row.level === '2' " type="warning">三级</el-tag>
                </template>

            </el-table-column>

        </el-table>

    </el-card>
</div>
</template>

<script>
export default {
    data() {
        return {
            rightlist: []
        }
    },
    created() {
        this.getRightList();
    },
    methods: {
        async getRightList() {
            const {
                data: res
            } = await this.$http.get('rights/list')
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.rightlist = res.data
            console.log(this.rightlist)
        }
    }
}
</script>

<style scoped>

</style>
