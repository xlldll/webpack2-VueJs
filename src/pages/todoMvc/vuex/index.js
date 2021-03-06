import Vue from 'vue'
import Vuex from 'vuex'
import { getTodoGroups, addTodoGroup, getTodoGroup, updateItem, addItem, delTodoGroup, updateTodoGroup } from '../api/api'
Vue.use(Vuex)
const store = new Vuex.Store({
	state    : {
		// 所有的待办集合
		groups : [],
		// 当前选中的待办集合
		group  : {},
		// 当前选中的待办集合ID
		groupId: ''
	},
	getters  : {
		getGroups (state) {
			return state.groups
		},
		getGroup (state) {
			return state.group
		},
		getGroupID (state) {
			return state.groupId
		},
		getGroupItems (state) {
			return state.group.items
		}
	},
	mutations: {
		// 设置所有的待办集合
		setGroups (state, data) {
			state.groups = data
		},
		// 设置单个待办集合
		setGroup (state, data) {
			state.group = data
		},
		// 设置当前选中的待办集合ID
		setGroupID (state, data) {
			state.groupId = data
		},
		addGroup (state, data) {
			state.groups.push(data)
		},
		// 设置集合锁定
		toggleGroupsLock (state, id) {
			// 右侧标题栏的锁定图标
			state.group.isLock = !state.group.isLock
			// 菜单栏的锁定图标
			state.groups.filter(group => {
				if (group.id == id) {
					group.isLock = state.group.isLock
				}
			})
		},
		// 设置未完成项目数量
		setGroupCount (state, data) {
			if (data) {
				state.group.count--
				state.groups.filter(group => {
					if (group.id == state.groupId) {
						group.count = state.group.count
					}
				})
			} else {
				state.group.count++
				state.groups.filter(group => {
					if (group.id == state.groupId) {
						group.count = state.group.count
					}
				})
			}
		},
		setGroupItemDel (state, index) {
			state.group.items[index].isDelete = true
			// console.log(state.groups)
			// console.log(state.group)
		},
		// 指定待办集合中增加新项目
		addGroupItem (state, text) {
			state.group.items.push({
				text    : text,
				isDelete: false,
				isChked : false
			})
			// console.log(state.groups)
			// console.log(state.group)
		},
		// 根据ID替换Groups中的某个Group
		updateGroup (state, data) {
			// console.log('updateGroup')
			// console.log(state.groups)
			state.groups.some((group) => {
				if (group.id === data.id) {
					group.title = data.title
					group.isDelete = data.isDelete
					group.isLock = data.isLock
					group.count = data.count
					return true
				}
			})
		}
	},
	actions  : {
		// 查找所有的待办集合
		asyncGroups ({state, commit, dispatch}) {
			// 注意：此处没有.then(res => res.data)
			// 注意：此处返回的new Promise 就是确保dispatch('asyncGroup')完成之后再返回
			return new Promise((resolve, reject) => {
				getTodoGroups({}).then(res => {
					// console.log(res)
					// console.log(res.data)
					const GROUPS = res.data.groups
					commit('setGroups', GROUPS)
					commit('setGroupID', GROUPS[0].id)
					// dispatch('asyncGroup')
					resolve(GROUPS[0].id)
				})
			})
		},
		// 根据ID查找指定的待办集合
		asyncGroup ({state, commit, rootState}, data) {
			// console.log('params', params)
			// console.log('state.groupId', state.groupId)

			return new Promise((resolve, reject) => {
				// console.log(`asyncGrouping: ${data}`)
				// console.log(`asyncGrouping: ${state.groupId}`)
				let id = data || state.groupId
				if (id) {
					commit('setGroupID', id)
					getTodoGroup(id).then(res => {
						// console.log(res)
						// console.log(res.data)
						const GROUP = res.group
						commit('setGroup', GROUP)
						resolve(GROUP)
					})
				}
			})
		},
		// 新增待办集合
		asyncAddGroup ({state, commit, dispatch}) {
			return new Promise((resolve, reject) => {
				addTodoGroup({}).then(res => {
					// console.log(res)
					// console.log(res.data)
					// console.log(`这是asyncAddGroup之后`)
					const GROUP = res.group
					commit('addGroup', GROUP)
					commit('setGroup', GROUP)
					commit('setGroupID', GROUP.id)
					resolve(GROUP.id)
				})
			})
		},
		// 设置集合锁定
		asyncGroupsLock ({state, commit, dispatch}, id) {
			// console.log(id)
			commit('toggleGroupsLock', id)
			console.log(state.group)
			dispatch('asyncUpdateGroup', state.group)
		},
		// 删除待办集合
		asyncDelGroup ({state, commit, dispatch, getters}, id) {
			return new Promise((resolve, reject) => {
				delTodoGroup({id: id}).then(res => {
					// console.log(res)
					// console.log(res.data)
					const GROUPS = res.groups
					// 删除到剩下最后一个集合时
					// console.log(GROUPS)
					if (GROUPS[0]) {
						commit('setGroupID', GROUPS[0].id)
						dispatch('asyncGroups')
						resolve(GROUPS[0].id)
					} else {
						// 自动添加一个新集合
						dispatch('asyncAddGroup').then((id) => {
							// console.log(`这是dispatch('asyncAddGroup')之后`)
							dispatch('asyncGroups')
							resolve(id)
						})
					}
				})
			})
		},
		// 更新待办集合
		asyncUpdateGroup ({state, commit, dispatch, getters}, data) {
			updateTodoGroup(data).then(res => {
				// console.log(res)
				// console.log(data)
				commit('setGroup', data)
				commit('updateGroup', data)
			})
		},

		// 指定待办集合中增加新项目
		asyncAddItem ({state, commit, dispatch, getters}, {text}) {
			// console.log(text)
			commit('addGroupItem', text)
			commit('setGroupCount', false)
			addItem({id: getters.getGroupID, text: text})
		},
		// 更新指定待办集合中的项目
		asyncUpdateItems ({state, commit, dispatch, getters}, {item, index}) {
			// console.log('item')
			// console.log(item)
			// console.log(index)
			updateItem({id: getters.getGroupID, items: item, index: index})
		}
	}
})
export default store
