<template>
	<div class = "iconfont icon-uptop" v-show = "show" @click = "handleBackTop"></div>
</template>

<style lang = "less">
	.iconfont.icon-uptop {
		position: fixed;
		right: 10px;
		bottom: 80px;
		z-index: 100;
		
		color: #42b983;
		font-size: 5rem;
		cursor: pointer;
	}
</style>

<script>
	
	export default {
		data() {
			return {
				show : false,
				timer: ''
			}
		},
		mounted() {
			document.addEventListener('scroll', this.handleToggle, false);
		},
		beforeDestroy() {
			document.removeEventListener('scroll', this.handleToggle);
		},
		methods: {
			handleToggle() {
				const y = document.body.scrollTop || document.documentElement.scrollTop;
				if (y > 100) {
					this.show = true;
				} else {
					this.show = false;
				}
			},
			handleBackTop() {
				// TODO-ES6:实现了缓冲型回到顶部功能
				clearInterval(this.timer);
				this.timer = setInterval(function () {
					const now = document.body.scrollTop || document.documentElement.scrollTop;
					if (now === 0) {
						clearInterval(this.timer);
						return;
					}
					const speed = Math.floor(-now / 10);
					document.body.scrollTop = document.documentElement.scrollTop = now + speed;
				}.bind(this), 15)
			}
		}
	}
</script>
