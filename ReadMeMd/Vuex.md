#### 1.Vuex

```JS
/*Getters*/

// 可以认为是 store 的计算属性
// 数据过滤处理，保留isdeleted为false 的数据
// 注意：根 store 子模块 news 内的 getters 初始化比子组件 news.vue为 news.newsList 给予填充后台数据要早，所以要先判断源 state.newsList 不为空，方可过滤处理
const getters = {
  getNews (state, getters, rootState) {
    if (state.newsList) {
      return state.newsList.filter(news => {
        return !news.isdelected
      })
    }
  }
}

/*Actions*/

const actions = {
  // Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters。
  // 正因为 context 是对象，所以可以用对象的解构赋值，函数内的 commit = context.commit
  agree ({ state, commit, rootState }, newsid) {
    // 基于全局Vue对象使用http
    Vue.http.post('./php/agree.php', { newsid: newsid }, { emulateJSON: true }).then(function (res) {
      // 唤醒mutations中的setAgree方法，将从后台获取到的点赞数更新到Store.state
      commit(type.setAgree, res.body.agree)
    }, function (error) {
      console.log(error)
    })
  }
}

/*Mutations*/

// 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
// 不能直接调用一个 mutation.handler()，通过 commit 来调用
// 每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方
const mutations = {
  // agreeNum为mutation的载荷（Payload）
  // 在大多数情况下，载荷应该是一个对象
  [type.setAgree] (state, agreeNum) {
    state.newsDetl.agree += agreeNum
  }
}

```

* unknown getter 已解决，注意引入方式，引入的应该是对象