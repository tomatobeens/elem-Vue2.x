<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
          <div class="content-left">
              <div class="logo-wrapper">
                  <div class="logo" :class="{'highlight':totalCount>0}">
                      <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
                  </div>
                  <div class="num" v-show="totalCount>0">{{totalCount}}</div>
              </div>
              <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
              <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
          </div>
          <div class="content-right">
              <div class="pay" :class="payClass" @click.stop.prevent="pay">{{payDesc}}</div>
          </div>
          <!-- 下落小球 -->
          <div class="ball-container">
              <div v-for="(ball,index) in balls" :key="index">
                <!-- js钩子 -->
                  <transition name="drop" @before-enter="beforeDrop" @enter="dropping"
                  @after-enter="afterDrop">
                    <div class="ball" v-show="ball.show">
                        <div class="inner inner-hook"></div>
                    </div>
                  </transition>
              </div>
          </div>
            <!--列表详情页-->
          <transition name="fold">
            <div class="shopcart-list" v-show="listShow">
              <div class="list-header">
                <h1 class="title">商品名</h1>
                <span class="empty" @click="empty">清空</span>
              </div> 
              <div class="list-content" ref="listContent">
                <ul>
                  <li class="food" v-for="(food,index) in selectFoods" :key="index">
                    <span class="name">{{food.name}}</span>
                    <div class="price">
                      <span>￥{{food.price*food.count}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                      <cartcontrol :food="food"></cartcontrol>
                    </div>
                  </li>
                </ul>
              </div>                        
            </div>
          </transition>
      </div>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList"></div>        
    </transition>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import cartcontrol from '../cartcontrol/cartcontrol.vue'

export default {
    data() {
      return {
        balls:[
          {show:false},
          {show:false},
          {show:false},
          {show:false},
          {show:false}
        ],
        dropBalls:[],
        fold:true
      }
    },
    props:{
        selectFoods:{
          type:Array,
          default() {
            return [
              {
                price:0,
                count:0
              }
            ]
          }
        },
        minPrice:{
            type:Number,
            default:0
        },
        deliveryPrice:{
            type:Number,
            default:0
        }
    },
    components:{
      BScroll,
      cartcontrol
    },
    computed:{
      listShow() {
        //总数为0，不操作
        if(!this.totalCount){
          return;
        }
        let show = !this.fold;
        //如果显示，把listContent模块的bs初始化为可点击
        if(show){
          this.$nextTick(() => {
            if(!this.scroll){
              this.scroll = new BScroll(this.$refs.listContent,{
                click:true
              })             
            }else{
              this.scroll.refresh();
            }
          })
        }
        return show;
      },
      totalPrice() {
        //selectFoods是一个数组
        let total = 0;
        this.selectFoods.forEach(element => {
          total += element.count * element.price;
        });
        return total;
      },
      totalCount() {
        let total = 0;
        this.selectFoods.forEach(el => {
          total += el.count;
        })
        return total;
      },
      payClass() {
        if(this.totalPrice < this.minPrice){
          return 'not-enough';
        }else{
          return 'enough'
        }
      },
      payDesc() {
        if(this.totalPrice < this.minPrice){
          let diff = this.minPrice - this.totalPrice;
          //``是es6引入的，可以在里面换行写表达式
          return `还差￥${diff}起送`;
        }else{
          return '去结算';
        }
      }
    },
    methods:{
      drop(el) {
        //遍历balls，把show置true
        //把ball放入dropBalls
        this.balls.forEach((ball) => {
          if(!ball.show){
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
          }
        })
      },
      beforeDrop(el) {
        //遍历所有小球，找到show为true的小球
        this.balls.forEach((ball) => {
          if(ball.show){
            //返回元素的大小以及相对于视口的位置的对象
            let rect = ball.el.getBoundingClientRect();
            //小球与添加位置的水平和垂直偏移
            let x = rect.left - 32;//左下角购物车和+小球的水平距离
            let y = -(window.innerHeight - rect.top - 22);//垂直距离
            //外层做一个纵向变化
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;//有表达式用``方便
            el.style.transform = `translate3d(0,${y}px,0)`;
            //内层做一个横向变化
            let inner = el.getElementsByClassName("inner-hook")[0];//取第一个
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        })
      },
      dropping(el,done) {
        this.rf = el.offsetHeight;
        //使用异步加载会流畅点，但是队afterdrop有影响
        // this.$nextTick(() => {
          //下落时重写内部的translate3d
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName("inner-hook")[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener("transitionend",done);
       // })
      },
      afterDrop(el) {
        //下落完一个ball，把他从balls取出
        let ball = this.dropBalls.shift();
        if(ball.show){
          //又可以利用这个ball
          ball.show = false;
          el.style.display = 'none';
        }
      },
      toggleList() {
        //没有商品点击无效
        if(!this.totalCount){
          return;
        }
        //收起则展开，反之亦然
        this.fold = !this.fold;
      },
      hideList() {
        //点击mask模块，详情页收起
        this.fold = true;
      },
      empty() {
        //把selectFoods里面商品的数量清空
        this.selectFoods.forEach((food) => {
          food.count = 0;
        })
      },
      pay() {
        //支付的触发事件
        if(this.totalPrice > this.minPrice){
          window.alert(`支付￥${this.totalPrice}`);
        }else{
          return;
        }
      }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)
      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px
  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>
