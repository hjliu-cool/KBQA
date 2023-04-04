<template>
  <div>
    <h1>管理界面</h1>
    <table>
      <thead>
      <tr>
        <th>姓名</th>
        <th>邮箱</th>
        <th>电话</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in data" :key="index">
        <td>{{ item.name }}</td>
        <td>{{ item.email }}</td>
        <td>{{ item.phone }}</td>
        <td>
          <button @click="editItem(index)">编辑</button>
          <button @click="deleteItem(index)">删除</button>
        </td>
      </tr>
      </tbody>
    </table>
    <form v-if="showForm" @submit.prevent="handleSubmit">
      <input type="text" v-model="form.name" placeholder="姓名">
      <input type="email" v-model="form.email" placeholder="邮箱">
      <input type="tel" v-model="form.phone" placeholder="电话">
      <button type="submit">{{ formIndex === null ? '添加' : '保存' }}</button>
      <button type="button" @click="handleCancel">取消</button>
    </form>
    <button @click="addItem">添加</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [
        { name: '张三', email: 'zhangsan@example.com', phone: '12345678901' },
        { name: '李四', email: 'lisi@example.com', phone: '23456789012' },
        { name: '王五', email: 'wangwu@example.com', phone: '34567890123' }
      ],
      form: {
        name: '',
        email: '',
        phone: ''
      },
      formIndex: null,
      showForm: false
    }
  },
  methods: {
    addItem() {
      this.showForm = true
      this.formIndex = null
      this.form = {
        name: '',
        email: '',
        phone: ''
      }
    },
    editItem(index) {
      this.showForm = true
      this.formIndex = index
      this.form = { ...this.data[index] }
    },
    deleteItem(index) {
      this.data.splice(index, 1)
    },
    handleSubmit() {
      if (this.formIndex === null) {
        this.data.push(this.form)
      } else {
        this.data.splice(this.formIndex, 1, this.form)
      }
      this.showForm = false
      this.formIndex = null
      this.form = {
        name: '',
        email: '',
        phone: ''
      }
    },
    handleCancel() {
      this.showForm = false
      this.formIndex = null
      this.form = {
        name: '',
        email: '',
        phone: ''
      }
    }
  }
}
</script>
