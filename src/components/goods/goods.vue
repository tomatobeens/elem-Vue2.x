<template>
    <div class="goods">
        <!-- ref给元素或者子组件注册信息到vm.$refs对象上 -->
        <div class="menu-wrapper" ref="menuWrapper">
            <ul>
                <li v-for="(item,index) in goods" :key="index" class="menu-item" :class="{'current':currentIndex === index}" 
                @click="selectItem($event,index)">
                    <span class="text border-1px">
                    <!--v-show使用-->
                        <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foods-wrapper" ref="foodsWrapper">
                <ul>
                    <!-- hook钩子类的使用，一般需要操作dom时使用这样的类名格式 -->
                    <li v-for="(item,index) in goods" :key="index" class="food-list food-list-hook" ref="foodList">
                        <h1 class=title>{{item.name}}</h1>
                        <ul>
                            <!-- vue中有关循环的可以优先考虑用ul -->
                            <li v-for="(food,index) in item.foods" :key="index" class="food-item">
                                <div class="icon">
                                    <img width="57px" height="57px" :src="food.icon">
                                </div>
                                <!-- 图片区和内容区可以分2个块 -->
                                <div class="content">
                                    <h2 class="name">{{food.name}}</h2>
                                    <p class="desc">{{food.description}}</p>
                                    <div class="extra">
                                        <span class="count">月售{{food.sellCount}}份</span>
                                        <span>好评率{{food.rating}}%</span>
                                    </div>
                                    <div class="price">
                                        <span class="now">￥{{food.price}}</span>
                                        <span class="old" v-show="food.oldPrice">￥{{food.price}}</span>
                                    </div>
                                    <!--接收goods的food为shopcart所用-->
                                    <div class="cartcontrol-wrapper">
                                        <cartcontrol :food="food" @add="addFood"></cartcontrol>                                    
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
        </div>
        <shopcart :minPrice="seller.minPrice" :deliveryPrice="seller.deliveryPrice"
        :select-foods="selectFoods" ref="shopcart"></shopcart>
    </div>
</template>

<script>
import BScroll from "better-scroll";
import shopcart from '../shopcart/shopcart.vue';
import cartcontrol from '../cartcontrol/cartcontrol.vue'
const response = require('../../common/goods.json')

const ERR_OK = 0;

export default {
    components:{
        shopcart,
        cartcontrol
    },
    props:{
        seller:{
            type:Object,
            required:true
        }
    },
    data() {
        return{
            goods:[],
            scrollY:0,
            listHeight:[]
        }
    },
    created() {
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

        //获取goodsd的数据
        // this.$http.get('/api/goods').then((response) => {
        //     response = response.body;
        //     if(response.errno === ERR_OK){
        //         this.goods = response.data;
        //         /*
        //         *Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，而是按一定的策略进行 
        //         *DOM 的更新。$nextTick 是在下次 DOM 更新循环结束之后执行延迟回调，在修改
        //         *数据之后使用 $nextTick，则可以在回调中获取更新后的 DOM，
        //         *一些需要vue完成更新dom后才执行的函数需要写在$nextTick中
        //         *****因为数据是根据请求获取的，所以应该放在请求的回调函数内，不然无法获取到goods
        //         *列表的全部元素
        //         */                
        //         this.$nextTick(() => {
        //             this._initScroll()
        //             this._getHeight()
        //         });                
        //     }
        // })
        if (response.errno === ERR_OK) {
            this.goods = response.data;
            this.$nextTick(() => {
            this._initScroll();
            this._getHeight();
        });
      }
    },
    methods:{
         //把需要滚动的块实例化
        _initScroll(){
            /*
            *better-scroll的实现原理是监听tonchStart和tonched事件，阻止了默认事件，
            *在这里要做点击的话需要派发一个点击事件
            *在pc端，点击事件不会阻止，所以会触发2次click，可以在绑定事件时把$event穿过去
            */
           this.menuScroll = new BScroll(this.$refs.menuWrapper,{
               click:true
           })
           this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
               click:true,
               probeType:3//探针效果，实时获取foods-wrapper区的滚动高度
           })
          
            //监听foodsScroll，实时获取他的位置pos.y
            this.foodsScroll.on("scroll",(pos) => {
                this.scrollY = Math.abs(Math.round(pos.y))
            })
        },
        //获取商品区个商品块的高度，保存到数组listHeight
        _getHeight(){
            //或者this.$ref.foodList(也是一个数组)
            let foodList = this.$refs.foodsWrapper.getElementsByClassName("food-list-hook");
            let height = 0;
            this.listHeight.push(height);
            for (let i = 0; i < foodList.length; i++) {
            let item = foodList[i];
            height += item.clientHeight;
            this.listHeight.push(height);
            }
        },
        //用于点击菜单定位到对应的商品区
        selectItem(event,index){
            //原生浏览器点击事件event没有_constructed属性，遇到要return掉
            // if(!_constructed){
            //     return;
            // }
            //scrollToElement是better-scroll里的方法
            //由于传入了原生$event，所以可以使用document
            let goodList = document.getElementsByClassName("food-list-hook");
            let el = goodList[index];
            this.foodsScroll.scrollToElement(el,300);
        },
        //通过监听add事件拿到cartcontrol中的添加对象，通过target传到goods.vue
        addFood(target) {
            //在goods.vue拿到子对象，从而编写小球下落函数
            this._drop(target);
        },
        //小球下落动作
        _drop(target) {
            //优化用户体验,异步执行下落
            this.$nextTick(() => {
                //调用shopcart,给他定义一个小球下落函数drop
                //然后在shopcart.vue定义drop(),描写小球下落
                //通过this.$ref.shopcart拿到子组件，就可以调用子组件的方法
                this.$refs.shopcart.drop(target);
            })
        }
    },
    computed: {
        //用于实现滚动商品区时，菜单定位到相应位置
        currentIndex: function() {
            for (let i = 0; i < this.listHeight.length; i++) {
                let height1 = this.listHeight[i];
                let height2 = this.listHeight[i + 1];
                if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                    return i;
                }
            }
             return 2;
        },
        //用于把选择的商品传给shopcart的selectFoods
        selectFoods() {
            let foods = [];
            this.goods.forEach((good) => {
                good.foods.forEach((food) => {
                    if(food.count){
                        foods.push(food);
                    }
                })
            });
            return foods;
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl'

.goods
    display: flex
    position: absolute //根据设计图实现,
    top: 174px //去掉header和tab的位置
    bottom: 46px //预留购物车位置
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px //flex布局预留空间
      width: 80px //兼容android浏览器,不加的话会没办法预留空间
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #ffffff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-img('decrease_3')
          &.discount
            bg-img('discount_3')
          &.guarantee
            bg-img('guarantee_3')
          &.invoice
            bg-img('invoice_3')
          &.special
            bg-img('special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle //table默认支持垂直居中
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px: (rgba(7, 17, 27, 0.1))
        &:last-child
          border-none() 
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1 //flex布局等分剩下空间
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            margin-bottom: 8px
            line-height: 12px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(240, 20, 20)
        .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px   
</style>


