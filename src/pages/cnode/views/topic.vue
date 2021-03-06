<template>
	<!--主题详情-->
	<div>
		<!-- 全局header -->
		<nv-head page-type = "主题"
		         :show-menu = "showMenu"
		         :need-add = "true"
		         :fix-head = "true">
		</nv-head>
		
		<div id = "page" :class = "{'show-menu':showMenu}" v-if = "topic.title">
			<!--主题标题-->
			<h2 class = "topic-title" v-text = "topic.title"></h2>
			<!--主题信息-->
			<section class = "author-info">
				<img class = "avatar" :src = "topic.author.avatar_url" />
				<div class = "col">
					<span>{{topic.author.loginname}}</span>
					<time>发布于:{{topic.create_at | getLastTimeStr(true)}}</time>
				</div>
				<div class = "right">
					<span class = "tag"
					      :class = "getTabInfo(topic.tab, topic.good, topic.top, true)"
					      v-text = "getTabInfo(topic.tab, topic.good, topic.top, false)"> </span>
					<span class = "name">{{topic.visit_count}}次浏览</span>
				</div>
			</section>
			<!--主题内容-->
			<section class = 'markdown-body topic-content' v-html = "topic.content"></section>
			<!--主题回复数量-->
			<h3 class = "topic-reply">
				<strong>{{topic.reply_count}}</strong> 回复
			</h3>
			<!--主题回复列表-->
			<section class = "reply-list">
				<ul>
					<li v-for = "item in topic.replies">
						<section class = "user">
							<!--回复作者头像-->
							<router-link :to = "{name:'user',params:{loginname:item.author.loginname}}">
								<img class = "head" :src = "item.author.avatar_url" />
							</router-link>
							<!--回复作者信息-->
							<div class = "info">
								<span class = "cl">
									<span class = "name" v-text = "item.author.loginname"></span>
									<span class = "name mt10">
										<span></span> 发布于:{{item.create_at | getLastTimeStr(true)}}</span>
								</span>
								<!--点赞以及点评-->
								<span class = "cr">
									<span class = "iconfont icon"
									      :class = "{'uped':isUps(item.ups)}"
									      @click = "upReply(item)">&#xe608;</span> {{item.ups.length}}
									<span class = "iconfont icon" @click = "addReply(item.id)">&#xe609;</span>
								</span>
							</div>
						</section>
						<!--回复内容-->
						<div class = "reply_content" v-html = "item.content"></div>
						<!--回复该主题的层主编辑框-->
						<nv-reply :topic.sync = "topic"
						          :show.sync = "curReplyId"
						          :topic-id = "topicId"
						          :reply-id = "item.id"
						          :reply-to = "item.author.loginname"
						          @close = "hideItemReply"
						          v-if = "userInfo.userId && curReplyId === item.id"></nv-reply>
					</li>
				</ul>
			</section>
			<!--回到顶部-->
			<nv-top></nv-top>
			<!--回复该主题的编辑框-->
			<nv-reply v-if = "userInfo.userId" :topic = "topic" :topic-id = "topicId"></nv-reply>
		</div>
		<div class = 'no-data' v-if = "noData">
			<i class = "iconfont icon-empty">&#xe60a;</i> 该话题不存在!
		</div>
	</div>
</template>
<script>
	import Zepto from 'webpack-zepto';
	import * as utils from '../assist/utils.js';
	import nvHead from '../components/header.vue';
	import nvReply from '../components/reply.vue';
	import nvTop from '../components/backtotop.vue';
	import { mapGetters } from 'vuex';
	export default {
		components: {
			nvHead,
			nvReply,
			nvTop
		},
		data() {
			return {
				// 是否展开左侧菜单
				showMenu  : false,
				// 主题详情
				topic     : {},
				// 主题详情ID
				topicId   : '',
				// 回复列表项目ID
				curReplyId: '',
				noData    : false
			};
		},
		computed  : {
			...mapGetters({
				userInfo: 'getUserInfo'
			})
		},
		mounted() {
			// 隐藏左侧展开菜单
			this.showMenu = false;
			// 获取url传的tab参数
			this.topicId = this.$route.params.id;
			// 加载主题数据
			Zepto.get('https://cnodejs.org/api/v1/topic/' + this.topicId, (d) => {
				if (d && d.data) {
					this.topic = d.data;
				} else {
					this.noData = true;
				}
			});
		},
		methods   : {
			getTabInfo(tab, good = false, top, isClass) {
				return utils.getTabInfo(tab, good, top, isClass);
			},
			getLastTimeStr(time, ago) {
				return utils.getLastTimeStr(time, ago);
			},
			isUps(ups) {
				return Zepto.inArray(this.userInfo.userId, ups) >= 0;
			},
			// 回复主题
			addReply(id) {
				this.curReplyId = id;
				if (!this.userInfo.userId) {
					this.$router.push({
						name  : 'login',
						params: {
							redirect: encodeURIComponent(this.$route.path)
						}
					});
				}
			},
		    // 清空回复者ID，间接关闭了回复层主的编辑框
			hideItemReply() {
				this.curReplyId = '';
			},
			// 为评论点赞
			upReply(item) {
				if (!this.userInfo.userId) {
					this.$router.push({
						name  : 'login',
						params: {
							redirect: encodeURIComponent(this.$route.path)
						}
					});
				} else {
					Zepto.ajax({
						type    : 'POST',
						url     : 'https://cnodejs.org/api/v1/reply/' + item.id + '/ups',
						data    : {
							accesstoken: this.userInfo.token
						},
						dataType: 'json',
						success : (res) => {
							if (res.success) {
								if (res.action === 'down') {
									let index = Zepto.inArray(this.userInfo.userId, item.ups);
									item.ups.splice(index, 1);
								} else {
									item.ups.push(this.userInfo.userId);
								}
							}
						},
						error   : (res) => {
							let error = JSON.parse(res.responseText);
							this.$alert(error.error_msg);
							return false;
						}
					});
				}
			}
		},
	};
</script>
