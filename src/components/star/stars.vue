<template>
    <div class="star" :class="starSize">
        <span v-for="(starItem,index) in starItems" :key="index"
        class="star-item" :class="starItem"></span>
    </div>
</template>

<script>
const LENGTH = 5;
const CLS_ON = 'on';
const CLS_OFF = 'off';
const CLS_HALF = 'half';

export default {
    props:{
        size:{
            type:Number,
            require:true
        },
        score:{
            type:Number,
            require:true
        }
    },
    computed:{
        starSize(){
            //对于星星的大小，可以在外层定义
            return 'star-'+this.size;
        },
        starItems(){
            let result = [];
            let score = Math.floor(this.score*2)/2;
            let hasDecimal = (score%1!==0);
            let integer = Math.floor(score);
            for(let i=0;i<integer;i++){
                result.push(CLS_ON);
            }
            if(hasDecimal){
                result.push(CLS_HALF);
            }
            while(result.length<LENGTH){
                result.push(CLS_OFF);
            }
            return result;
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl'

    .star
        font-size:0
        .star-item
            display:inline-block
            background-repeat:no-repeat
        &.star-48 
            .star-item
                width:20px
                height:20px
                margin-right:22px
                background-size:20px 20px
                &:last-child
                    margin-right:0                
                &.on
                    bg-img('star48_on')
                &.half
                    bg-img('star48_half')
                &.off
                    bg-img('star48_off')
        &.star-36 
            .star-item
                width:15px
                height:15px
                margin-right:6px
                background-size:15px 15px
                &:last-child
                    margin-right:0
                &.on
                    bg-img('star36_on')
                &.half
                    bg-img('star36_half')
                &.off
                    bg-img('star36_off')
        &.star-24 
            .star-item
                width:10px
                height:10px
                margin-right:3px
                background-size:20px 20px
                &:last-child
                    margin-right:0                
                &.on
                    bg-img('star24_on')
                &.half
                    bg-img('star24_half')
                &.off
                    bg-img('star24_off')                            
</style>