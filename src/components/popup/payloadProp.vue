<template>
    <div class="descriptions payloadProp">
        <div class="main" v-for="(desc, INDEX) in layout">
            <el-descriptions :column="desc.column" :size="size" :style="blockMargin" border style="margin-top: 0;"
                :key="INDEX">
                <el-descriptions-item v-for="(item, index) in desc.items" :span="item.span" align="right">
                    <template #label>
                        <div class="label-item">
                            {{ item.label }}
                        </div>
                    </template>
                    <div class="content-item" v-if="item.content">{{ item.content }}
                        <div class="btn" v-if="item.btn">
                            <el-button class="btn1">{{ item.btn }}</el-button>
                        </div>
                    </div>
                </el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import {
    Check,
    Delete,
    Edit,
    Message,
    Search,
    Star,
} from '@element-plus/icons-vue'

const gutter = ref(0);//折叠项间距
const collapsedNames = ref([])

const size = ref('default')
const blockMargin = computed(() => {
    const marginMap = {
        large: '32px',
        default: '28px',
        small: '24px',
    }
    return {
        marginTop: marginMap[size.value] || marginMap.default,
    }
})

const layout = [
    {
        title: '',
        column: 2,
        items: [
            {
                label: '方位向带宽(Hz)',
                span: 3,
                content: '4261.141453',

            },
            {
                label: '距离向带宽(Hz)',
                span: 3,
                content: '654513213',

            },
            {
                label: '波束半角(度',
                span: 3,
                content: '12.8',

            },
            {
                label: '脉冲重复频率(Hz)',
                span: 3,
                content: '6000',

            },
            {
                label: '采样率(Hz)',
                span: 3,
                content: '813435453435',

            },
            {
                label: '分辨率(米)',
                span: 3,
                content: '0.3',

            },

        ]
    },


]
</script>


<style lang="scss" scoped>
$color1: gray;
$color2: #0E5894;
$color3: white;

.content {
    background-color: aquamarine;
}

.label.col {
    text-align: right;
    padding-left: 0;
    margin-left: 0px;
}

.label-item {
    color: $color3;
    width: 100px;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
}

.label-item0 {
    width: 60px;
}

.content-item {
    color: $color3;
    font-size: 12px;
    background-color: $color2;
    text-align: left;
    position: relative;

    .btn {
        position: absolute;
        top: -1px;
        right: 0;
        background-color: $color1;
        width: 60px;
        height: 25px;
        text-align: center;

        .btn1 {
            width: 50px;
            height: 20px;
            font-size: 10px;
        }
    }
}

.descrTitle {
    color: $color3;
    font-size: 12px;
}
</style>
<style lang="scss">

</style>

