<template>
	<div>
		<keep-alive>
			<router-view v-if="$route.meta.keepAlive"></router-view>
		</keep-alive>
		<router-view v-if="!$route.meta.keepAlive"></router-view>
		<!--显示底部迷你播放器-->
		<Player v-show = "songList.length > 0 && !showDetail"></Player>
		<!--横向滚动条-->
		<Toast ref = "alert"></Toast>
	</div>
</template>
<script>
  import Player from './components/playerBar'
  import { mapGetters } from 'vuex'
  
  export default {
    components : {
      Player
    },
    data () {
      return {
        toast: false
      }
    },
    computed   : {
      ...mapGetters([
        'songList',
        'showDetail'
      ])
    },
    created    : function () {
      console.log(`created`)
    },
    mounted    : function () {
      console.log(`mounted`)
    },
    activated  : function () {
      console.log(`activated`)
    },
    deactivated: function () {
      console.log(`deactivated`)
    }
  }
</script>
<style>
	body,html{
		overflow: hidden;
	}
</style>
