<template>
	<div>
		<nv-head></nv-head>
		<div class = "topic" v-if = "topicInfo.title">
			<h2 class = "topic-title" v-text = "topicInfo.title"></h2>
			
			<section class = "author-info">
				<router-link :to = "{name:'user',params:{loginname:topicInfo.author.loginname}}">
					<img :src = "topicInfo.author.avatar_url" alt = "" class = "avatar">
				</router-link>
				
				<div class = "center">
					<span class = "author" v-text = "topicInfo.author.loginname"></span>
					<time class = "info">
						发布于:{{topicInfo.create_at | getTimeInfo}}
					</time>
				</div>
				<div class = "right">
					<span class = "tag" v-text = "getTabInfo(topicInfo)"
					      :class = "{color: topicInfo.good || topicInfo.top}"></span>
					<span class = "name">{{topicInfo.visit_count}}次浏览</span>
				</div>
			</section>
			
			<section class = 'markdown-body topic-content' v-html = "topicInfo.content"></section>
			
			<section class = "topic-reply">
				<h3 class = "topic-total">
					<strong>{{topicInfo.reply_count}}</strong> 回复
				</h3>
				
				<ul class = "reply-list">
					<li v-for = "item in topicInfo.replies">
						<section class = "user">
							<router-link :to = "{name:'user',params:{loginname:item.author.loginname}}">
								<img class = "head" :src = "item.author.avatar_url" />
							</router-link>
							<div class = "info">
								<span class = "left">
									<span class = "name" v-text = "item.author.loginname"></span>
									<span class = "name"> 发布于:{{item.create_at | getTimeInfo}} </span>
								</span>
								<span class = "right">
									<span style = "margin-right: 5px" class = "iconfont icon-dianzan"
									      :class = "{'uped': isUps(item.ups)}"
									      @click = "handleUpReply(item)"></span>
									<span style = "margin-right: 5px">{{item.ups.length}}</span>
									<!--回复层主-->
									<span class = "iconfont icon-hf" @click = "addReply(item.id)"></span>
									<!--自定义测试-->
									<span class = "iconfont icon-hf" @click = "addItem(item)">自定义测试</span>
								</span>
							</div>
						</section>
						<div class = "reply-content markdown-body" v-html = "item.content"></div>
						<!--回复层主-->
						<nv-reply v-if = "userInfo.loginname && replyId === item.id"
						          :reply-to = "item.author.loginname"
						          :reply-id = "item.id"
						          :topic-id = "topicId"
						          :focus = "true"
						          @onReply = "handleReply"></nv-reply>
					</li>
				</ul>
			</section>
			<!--回复主题-->
			<nv-reply v-if = "userInfo.loginname" :topic-id = "topicId"></nv-reply>
		</div>
		<nv-top></nv-top>
		<nv-load :show = "showLoad"></nv-load>
	</div>
</template>

<script>
	import { mapState } from 'vuex';
	import nvHead from '../components/header';
	import nvReply from '../components/reply';
	import nvTop from '../components/backTop';
	import nvLoad from '../components/loading';
	import { GET_TOPIC_INFO, UP_REPLY } from '../constants/mutationTypes';
	import { getTimeInfo } from '../utils/index';
	import { topicTab } from '../constants/topicInfo';
	import { upReply } from '../apis/publicApi';
	import store from '../vuex/index';
	export default {
		components: {
			nvHead,
			nvReply,
			nvTop,
			nvLoad
		},
		data() {
			return {
				replyId: '',
				topicId: '',
			}
		},
		beforeRouteEnter(to, from, next) {
			//清空主题详情内容
			store.state.topicInfo = {};
			next();
		},
		mounted() {
			this.topicId = this.$route.params.id;
			this.getTopicInfo();
		},
		computed  : {
			...mapState(['topicInfo', 'userInfo', 'showLoad'])
		},
		methods   : {
			getTopicInfo() {
				this.$store.dispatch(GET_TOPIC_INFO, this.topicId);
			},
			getTabInfo(item) {
				let tab = item.tab;
				if (item.good) {
					tab = 'good';
				} else if (item.top) {
					tab = 'top';
				}
				return topicTab[tab]
			},
			// 回复层主
			addReply(id) {
				if (!this.userInfo.loginname) {
					this.$router.push({
						name : 'login',
						query: {redirect: encodeURIComponent(this.$route.name)}
					});
				}
				this.replyId = id;
			},
			handleReply() {
				this.replyId = '';
			},
			isUps(ups) {
				return ups.indexOf(this.userInfo.id) > -1
			},
			// todo-vue:可以直接操作item!
			addItem(item){
				item.ups.push(this.userInfo.id);
				item.author.loginname = 'my'
			},
			// 点赞时提交回复
			handleUpReply(item) {
				if (!this.userInfo.loginname) {
					this.$router.push({
						name : 'login',
						query: {redirect: encodeURIComponent(this.$route.name)}
					});
					return;
				}
				upReply({accesstoken: this.userInfo.accesstoken}, item.id).then((res) => {
					if (res.success) {
						// 取消点赞
						if (res.action === 'down') {
							console.log(`取消点赞 item :`, item)
							const index = item.ups.indexOf(this.userInfo.id);
							if (index > -1) {
								item.ups.splice(index, 1);
							}
						} else {
							console.log(`点赞 item :`, item)
							item.ups.push(this.userInfo.id);
						}
					}
				})
			}
		},
		filters   : {
			getTimeInfo(str) {
				return getTimeInfo(str)
			}
		}
	}
</script>
