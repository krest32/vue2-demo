<template>
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <!-- 加入栅格系统 gutter代表栅格系统之间的间隔 -->
        <el-row :gutter="20">
            <el-col :span="8">
                <el-input placeholder="请输入内容" clearable @clear="getUserList" v-model="queryInfo.query">
                    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="addDialogVisible=true">添加用户按钮</el-button>
            </el-col>
        </el-row>

        <el-table :data="userlist" style="width: 100%" border stripe>
            <el-table-column type="index" label="#" align="center" />
            <el-table-column prop="username" label="姓名" align="center" />
            <el-table-column prop="role_name" label="角色" align="center" />
            <el-table-column prop="mobile" label="手机" align="center" />
            <el-table-column prop="email" label="邮箱" align="center" />
            <el-table-column prop="mg_state" label="状态" align="center">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="changeSwitchStatus(scope.row)" />
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size='mini' @click="showEditDialog(scope.row.id)" />
                    <el-button type="danger" icon="el-icon-delete" size='mini' @click="removeDataById(scope.row.id)" />
                    <el-tooltip class="item" effect="dark" content="修改权限" placement="top">
                        <el-button type="warning" icon="el-icon-setting" size='mini' @click="setRole(scope.row)" />
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <el-pagination style="padding: 30px 0; text-align: center" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <!-- 添加对话框区域 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addFormDialogClose">
            <!-- 内容主体区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 对话框按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAddForm">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改对话框区域 -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <!-- 内容主体区域 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 对话框按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleeditForm">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配角色对话框 -->
        <el-dialog title="分配角色" @close="setRoleDialogClosed" :visible.sync="setRoleDialogVisible" width="50%">
            <div>
                <p>当前的用户：{{userInfo.username}}</p>
                <p>当前的用户：{{userInfo.role_name}}</p>
                <p>分配新角色：</p>
                <el-select v-model="selectRoleId" placeholder="请选择">
                    <el-option v-for="role in roleslist" :key="role.id" :label="role.roleName" :value="role.id">
                    </el-option>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
    </el-card>
</div>
</template>

<script>
export default {
    data() {

        // 自定义校验规则
        var checkEmail = (rule, value, callback) => {
            // 定义校验规则
            const regEmail = /^\w+@\w+(\.\w+)+$/
            if (regEmail.test(value)) {
                return callback()
            }
            //返回一个错误提示
            callback(new Error('请输入合法的邮箱'))
        }

        var checkMobile = (rule, value, callback) => {
            // 验证手机的正则
            const regMobile = /^1[34578]\d{9}$/
            if (regMobile.test(value)) {
                return callback()
            }
            //返回一个错误提示
            callback(new Error('请输入合法的手机号码'))
        }

        return {
            selectRoleId: '',
            roleslist: [],
            userInfo: {},
            setRoleDialogVisible: false,
            // 获取用户列表的参数对象
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5
            },
            userlist: [],
            total: 0,

            // 控制对话框打开
            addDialogVisible: false,
            editDialogVisible: false,

            // 添加信息对话框
            addForm: {
                username: '',
                password: '',
                email: '',

            },
            // 添加信息对话框
            editForm: {
                username: '',
                password: '',
                email: '',

            },

            addFormRules: {
                username: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }, {
                    require: true,
                    min: 3,
                    max: 10,
                    message: '长度在 3 到 10 个字符',
                    trigger: 'blur'
                }],
                email: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }, {
                    validator: checkEmail,
                    message: '邮箱格式不正确，请重新输入',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }, {
                    min: 6,
                    message: '密码最小6位，请重新输入',
                    trigger: 'blur'
                }],
                mobile: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }, {
                    validator: checkMobile,
                    min: 6,
                    message: '手机号码不正确，请重新输入',
                    trigger: 'blur'
                }],
            },
            //修改表单的验证规则对象
            editFormRules: {
                email: [{
                        required: true,
                        message: '请输入邮箱',
                        trigger: 'blur'
                    },
                    {
                        validator: checkEmail,
                        message: '邮箱格式不正确，请重新输入',
                        trigger: 'blur'
                    }
                ],
                mobile: [{
                        required: true,
                        message: '请输入手机号码',
                        trigger: 'blur'
                    },
                    {
                        validator: checkMobile,
                        message: '手机号码不正确，请重新输入',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },

    created() {
        this.getUserList();
    },

    methods: {

        // 监听
        setRoleDialogClosed() {
            this.userInfo = {}
            this.selectRoleId = ''
        },

        // 点击按钮分配角色
        async saveRoleInfo() {
            if (!this.selectRoleId) {
                return this.$message.error("请选择要分配的角色")
            }
            const {
                data: res
            } = await this.$http.put(`users/${this.userInfo.id}/role`, {
                rid: this.selectRoleId
            })
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.$message.success(res.meta.msg)
            this.setRoleDialogVisible = false
        },

        // 分配权限
        async setRole(userInfo) {
            this.setRoleDialogVisible = true
            this.userInfo = userInfo
            // 获取所有的角色的列表
            const {
                data: res
            } = await this.$http.get('roles')
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.roleslist = res.data
        },

        // 删除数据
        async removeDataById(id) {
            //弹出确定取消框，是否删除用户
            const confirmResult = await this.$confirm('请问是否要永久删除该用户', '删除提示', {
                confirmButtonText: '确认删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            //如果用户点击确认，则confirmResult 为'confirm'
            //如果用户点击取消, 则confirmResult获取的就是catch的错误消息'cancel'
            if (confirmResult != "confirm") {
                return this.$message.info("已经取消删除")
            }
            //发送请求根据id完成删除操作
            const {
                data: res
            } = await this.$http.delete('users/' + id)
            //判断如果删除失败，就做提示
            if (res.meta.status !== 200) return this.$message.error('删除用户失败')
            //修改成功的提示
            this.$message.success('删除用户成功')
            //重新请求最新的数据
            this.getUserList()

        },

        // 关闭修改对话框
        editDialogClosed() {
            //对话框关闭之后，重置表达
            this.$refs.editFormRef.resetFields()
        },

        // 提交修改事件
        handleeditForm() {
            //用户点击修改表单中的确定按钮之后，验证表单数据
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return this.$message.error('请填写完整用户信息')
                //发送请求完成修改用户的操作
                const {
                    data: res
                } = await this.$http.put('users/' + this.editForm.id, this.editForm)
                //判断如果修改失败，就做提示
                if (res.meta.status !== 200) return this.$message.error('修改用户失败')
                //修改成功的提示
                this.$message.success('修改用户成功')
                //关闭对话框
                this.editDialogVisible = false
                //重新请求最新的数据
                this.getUserList()
            })
        },

        // 修改信息按钮事件
        async showEditDialog(id) {
            this.editDialogVisible = true;
            const {
                data: res
            } = await this.$http.get('users/' + id)
            //判断如果添加失败，就做提示
            if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
            //将获取到的数据保存到数据editForm中
            this.$message.success(res.meta.msg)
            this.editForm = res.data
            //显示弹出窗
            this.editDialogVisible = true

        },

        // 添加信息
        handleAddForm() {
            // 校验添加的数据信息，检验不通过，无法提交
            this.$refs.addFormRef.validate(async valid => {
                // 验证不通过，直接返回
                if (!valid) {
                    return;
                }
                // 校验通过，添加信息
                const {
                    data: res
                } = await this.$http.post("users", this.addForm)
                //判断如果添加失败，就做提示
                if (res.meta.status !== 201) {
                    return this.$message.error(res.meta.msg)
                }
                //添加成功的提示
                this.$message.success(res.meta.msg)
                //重新请求最新的数据
                this.getUserList()
                //关闭对话框
                this.addDialogVisible = false;
            })
            // addDialogVisible = false
        },

        // 关闭对话框重置信息
        addFormDialogClose() {
            // 重置信息
            this.$refs.addFormRef.resetFields();
        },

        // 修改开关状态
        async changeSwitchStatus(info) {
            // console.log(info)
            const {
                data: res
            } = await this.$http.put(`users/${info.id}/state/${info.mg_state}`)
            // 如果修改失败
            if (res.meta.status !== 200) {
                info.mg_state = !info.mg_state
                return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)

        },

        // 获取新的页数
        handleCurrentChange(newPageNum) {
            this.queryInfo.pagenum = newPageNum;
            this.getUserList();
        },

        // 改变每页显示的条数
        handleSizeChange(newPageSize) {
            this.queryInfo.pagesize = newPageSize;
            this.getUserList()
        },
        async getUserList() {
            const {
                data: res
            } = await this.$http.get('users', {
                params: this.queryInfo
            })
            console.log(res)
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.$message.success(res.meta.msg)
            this.userlist = res.data.users
            this.total = res.data.total
        }
    }
}
</script>

<style lang="less" scoped >
</style>
