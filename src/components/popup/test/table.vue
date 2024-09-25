<template>
    <div class="popup-statellite-descriptions2">
        <el-row class="title1 row" :gutter="gutter">
            <el-col :span="24">属性</el-col>
        </el-row>
        <el-row class="name row" :gutter="gutter" align="right">
            <el-col class="label col" :span="3">
                卫星名称
            </el-col>
            <el-col class="content col" :span="21">{{ info.name }}</el-col>
        </el-row>
        <el-row class="norad-id" :gutter="gutter">
            <el-col class="label col" :span="3">Norad-ID</el-col>
            <el-col class="content col" :span="21">{{ info.noradId }}</el-col>
        </el-row>
        <el-row class="type" :gutter="gutter">
            <el-col class="label col" :span="3">载荷类型</el-col>
            <el-col :span="9">{{ info.type }}</el-col>
            <el-col class="label col" :span="3">国家</el-col>
            <el-col class="content col" :span="9">{{ info.country }}</el-col>
        </el-row>
        <el-row class="tle1" :gutter="gutter">
            <el-col class="label col" :span="3">TLE-1</el-col>
            <el-col class="content col" :span="21">{{ info.tle1 }}</el-col>
        </el-row>
        <el-row class="tle2" :gutter="gutter">
            <el-col class="label col" :span="3">TLE-2</el-col>
            <el-col class="content col" :span="21">{{ info.tle2 }}</el-col>
        </el-row>
        <el-row class="title2" :gutter="gutter">
            <el-col class="label col" :span="24">状态</el-col>
        </el-row>
        <el-row class="status" :gutter="gutter">
            <el-col class="label col" :span="3">卫星状态</el-col>
            <el-col class="content col" :span="1">{{ info.status }}</el-col>
            <el-col :span="3">
                <el-button class="btn-wrong" style="width: 50px;height: 20px;font-size: 10px;">故障说明</el-button>
            </el-col>
        </el-row>
        <el-row class="position" :gutter="gutter">
            <el-col class="label col" :span="3">惯性系位置(Km)</el-col>
            <el-col class="content col" :span="21">{{ info.position }}</el-col>
        </el-row>
        <el-row class="velocity" :gutter="gutter">
            <el-col class="label col" :span="3">惯性系速度(Km/s)</el-col>
            <el-col class="content col" :span="21">{{ info.velocity }}</el-col>
        </el-row>
        <el-row class="zitaiAngle" :gutter="gutter">
            <el-col class="label col" :span="3">本体系姿态角(312)</el-col>
            <el-col :span="21">{{ info.zitaiAngle }}</el-col>
        </el-row>
        <el-row class="daoyinlv" :gutter="gutter">
            <el-col class="label col" :span="3">姿态角导引律(312)</el-col>
            <el-col class="content col" :span="21">{{ info.daoyinlv }}</el-col>
        </el-row>
        <el-row class="switch" :gutter="gutter">
            <el-col class="label col" :span="3">载荷开关机</el-col>
            <el-col class="content col" :span="21">{{ info.switch ? '开机' : '关机' }}</el-col>
        </el-row>
    </div>
</template>

<script setup>
const info = {
    name: '尖兵十三号03星',
    noradId: '99906',
    type: 'SAR',
    country: '中国',
    tle1: '1 99906U 21236 0000000 00004175 00000-0 52744-3 0',
    tle2: '1 99906U 21236 0000000 00004175 00000-0 52744-3 0',
    status: '正常',
    position: '(-1275.93, -3747.65, 5683.59)',
    velocity: '(0.20,6.31,4.20)',
    daoyinlv: '(00.0, 00.0, 00.0)',
    zitaiAngle: '(00.0, 00.0, 00.0)',
    switch: false,
}
</script>

<style lang="scss" scoped>
.content {
    background-color: aquamarine;
}

.label.col {
    text-align: right;
    padding-left: 0;
    margin-left: 0px;
}
</style>