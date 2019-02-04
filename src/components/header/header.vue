<template>
    <div class="header">
        <div class="content-wrapper">
            <div class="avatar">
                <img width="64" height="64" :src="seller.avatar">
            </div>
            <div class="describe-content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{seller.name}}</span>
                </div>
                <div class="deliveryTime">
                    <span>{{seller.description}}/{{seller.deliveryTime}}分钟送达</span>
                </div>
                <div v-if="seller.supports" class="support">
                    <span class="icon" :class="classMap[seller.supports[0].type]"></span>
                    <!--因为seller是异步获取的，supports开始是undefined的，需要判断该数组是否存在-->
                    <span class="icon-text">{{seller.supports[0].description}},满50减10</span>
                </div>
            </div>
            <div class="support-count" v-if="seller.supports" @click="showChange">
                <span class="sup-length">{{seller.supports.length}}</span>
                <i class="icon-keyboard_arrow_right"></i>
            </div>
        </div><!--content-wrapper-->

        <div class="bulletin-wrapper" @click="showChange">
            <span class="bulletin"></span>
            <span class="bul-text">{{seller.bulletin}}</span>
            <i class="icon-keyboard_arrow_right"></i>
        </div>

        <!--背景模糊处理的图片-->
        <div><img class="vague" :src="seller.avatar" width="100%" height="100%"></div>

        <!--弹出层,利用sticky-footers布局-->
        <div v-show="showDetail" class="popDetail">
            <div class="detail-wrapper clearfix">
                <div class="detail-main">
                    <h1 class="name">{{seller.name}}</h1>
                    <div class="stars">
                        <star :score="seller.score" :size="48"></star>
                    </div>
                    <vline class="lines" :textType="'优惠信息'"></vline>
                    <ul class="favourable">
                        <li class="fav-item" v-for="(fav,index) in seller.supports" :key="index">
                            <span class="icon" :class="classMap[fav.type]"></span>
                            <span class="text">{{fav.description}}</span>
                        </li>
                    </ul>
                    <vline class="lines" :textType="'商家公共'"></vline>
                    <div class="bulletin-all">{{seller.bulletin}}</div>
                </div>
            </div>
            <div class="close" @click="closeDetail">
                <i class="icon-close"></i>
            </div>
        </div>
    </div>
</template>

<script>
import star from '../star/stars.vue'
import vline from '../line/line.vue'

export default {
    data(){
        return{
            showDetail:false
        }
    },
    components:{
        star,
        vline
    },
    props:{//望每个 prop 都有指定的值类型。这时，你可以以对象形式列出 prop
        seller:{
            type:Object,
            require:true
        }
    },
    methods:{
        showChange(){
            this.showDetail = true
        },
        closeDetail(){
            this.showDetail = false
        }
    },
    created:function() {
        this.classMap = ["decrease","discount","guarantee","invoice","special"];
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl'

.header
    position:relative
    color:#fff
    overflow:hidden
    background-color:rgba(7,17,27,0.5)//rgba才有透明度
    .content-wrapper
        position:relative//设置相对定位便于子元素绝对定位
        padding:24px 12px 18px 24px
        //background:rgb(173,160,165)
        font-size:0//这个可以消除容器字体大小造成的间隙
        overflow:hidden
        .avatar
            display:inline-block//不会独占一行
            border-radius:4px;
        .describe-content
            display:inline-block
            vertical-align:top
            .title
                .brand
                    display:inline-block
                    margin:2px 6px 8px 16px
                    width:30px
                    height:18px//对于span内的图片应该设置宽高
                    bg-img("brand")
                    background-size:30px 18px
                    background-repeat:no-repeat
                .name
                    font-size:16px
                    color:rgb(255,255,255)
                    font-weight:bold
                    line-height:18px
                    vertical-align:top//考虑元素垂直对齐时可以用
            .deliveryTime
                font-size:12px
                display:inline-block
                margin-left:16px
            .support//stylus需要在其父类下写其子类样式
                .icon
                    display:inline-block
                    vertical-align:top
                    margin:10px 4px 2px 16px
                    width:12px
                    height:12px
                    background-size: 12px 12px
                    background-repeat: no-repeat
                    &.decrease
                        bg-img('decrease_1')
                    &.discount
                        bg-img('discount_1')
                    &.guarantee
                        bg-img('guarantee_1')
                    &.invoice
                        bg-img('invoice_1')
                    &.special
                        bg-img('special_1')
                .icon-text
                    display:inline-block
                    margin:10px auto 2px auto
                    font-size:10px
                    font-weight:200
                    line-height:12px
        .support-count
            position:absolute
            font-size:10px
            color:#fff
            line-heght:12px
            background-color:#878090
            border-radius:14px
            bottom:18px;
            right:12px;
            padding:7px 8px
            .sup-length
                display:inline-block
                margin-right:2px
    .bulletin-wrapper
        position:relative
        background-color:rgba(7,17,27,0.2)
        font-size:10px
        height:28px
        line-height:28px
        padding:0 22px 0 12px
        white-space:nowrap//不换行
        overflow:hidden
        text-overflow:ellipsis//文本溢出时省略
        .bulletin
            display:inline-block//display等级较高，可能会导致上层的一些padding等失效
            width:22px
            height:13px
            font-size:0
            bg-img('bulletin')
            background-size:22px 13px
            background-repeat:no-repeat
            margin-bottom:-2px
        .bul-text
            //这里不用display：inline-block，不然父样式的padding会被覆盖掉
            padding-left:4px
        .icon-keyboard_arrow_right
            //因overflow:hidden他在这里是脱离文档流不占空间的，可以用绝对定位
            position:absolute
            font-size:10px
            right:12px
            bottom:4px
    .vague
        position:absolute//利用相对和绝对定位实现和层级实现背景图片模糊
        top:0
        bottom:0
        left:0
        right:0
        z-index:-1
        filter:blur(10px)
    .popDetail
        position:fixed
        background-color:rgba(7,17,27,0.8)
        z-index:100
        top:0
        left:0
        width:100%
        height:100%
        overflow:auto
        .detail-wrapper 
            min-height:100%       
            .detail-main    
                margin:64px 36px 10px 36px 
                padding-bottom:64px    
                text-align:center
                .name
                    font-size:16px
                    font-weight:700px
                    line-height:16px
                    color:#fff
                .stars
                    margin:16px auto 28px auto
                .lines
                    margin:0 auto 24px auto
                    &:last-child
                        margin-top:28px
                .favourable
                    text-align:left
                    padding-left:12px
                    .fav-item
                        margin-bottom:12px
                        vertical-align:top
                        font-size:12px
                        font-weight:200
                        .icon
                            display:inline-block
                            margin:0
                            width:16px
                            height:16px
                            background-size:16px 16px
                            &.decrease
                                bg-img('decrease_2')
                            &.discount
                                bg-img('discount_2')
                            &.guarantee
                                bg-img('guarantee_2')
                            &.invoice
                                bg-img('invoice_2')
                            &.special
                                bg-img('special_2')   
                        .text
                            vertical-align:top      
                .bulletin-all
                    font-size:12px
                    font-weight:200
                    min-height:100%
                    line-height:24px                     
        .close
            position: relative
            width: 32px
            height: 32px
            margin: -64px auto 0 auto
            clear: both
            font-size: 32px
</style>
