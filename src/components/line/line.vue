<template>
    <div class="line-wrapper">
        <div class="line"></div>
        <div class="text">{{textType}}</div>
        <div class="line"></div>
    </div>
</template>

<script>
export default {
    props:{
        textType:{
            type:String,
            require:true
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .line-wrapper
        display:flex
        .text
            font-size:14px
            font-weight:700
            color:#fff
            line-height:14px
            margin:0 12px
        .line
            flex:1
            margin-bottom:6px
            border-bottom:solid 1px rgba(255,255,255,0.2)
</style>
