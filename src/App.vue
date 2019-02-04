<template>
    <div>
        <Header :seller="seller"></Header>
        <div class="tab border-1px">
            <div class="tab-item">
                <!-- 使用 router-link 组件来导航. -->
                <!-- 通过传入 `to` 属性指定链接. -->
                <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
                <router-link to="/goods">商品</router-link>
            </div>
            <div class="tab-item">
                <router-link to="/ratings">评价</router-link>
            </div>
            <div class="tab-item">
                <router-link to="/seller">商家</router-link>
            </div>
        </div>

        <!-- 路由出口
        路由匹配的组件将渲染在这里 -->
        <router-view :seller="seller"></router-view>
    </div>
</template>

<script>
import Header from './components/header/header.vue'
const response = require('./common/seller.json')

const ERR_OK = 0;

export default {
    //由于组件的复用，所以用data函数属性，因为对象可能会有影响
    data(){
        return{
            seller: {}
        }
    },
    components:{
      Header
    },
    created() {
        // this.$http.get('/api/seller').then((response) => {
        //     response = response.body;
        //     if(ERR_OK === response.errno){
        //         //已经在webpack.dev.conf.js模拟好了数据路径已经返回数据的类型
        //         this.seller = response.data;
        //     }
        // })
        if (response.errno === ERR_OK) {
            this.seller = response.data
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
// 手机端的像素比问题，在电脑上设置样式时，像素比是2：1 

@import './common/stylus/mixin.styl'

.tab
    display:flex
    justify-content:space-around
    width:100%
    height:40px
    line-height:40px
    border-1px(rgb(7,17,27,0.1))
    .tab-item//这里要注意，下级选择器要和上面样式对齐，而且等级样式也要对齐
        flex:1//项目等分空间
        text-align:center
        & > a//&代表上级选择器,>代表&下的什么
            display:block
            font-size:14px
            color:rgb(77,85,93)
            &.active
                color:rgb(240,20,20)
</style>
