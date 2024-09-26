<template>
    <div class="popup-statellite-descriptions payloadProp">
        <div class="main" v-for="(desc, INDEX) in layout">
            <el-descriptions :column="desc.column" :size="size" :style="blockMargin" border style="margin-top: 0;"
                :key="INDEX">
                <el-descriptions-item v-for="(item, index) in desc.items" :span="item.span" align="right">
                    <template #label>
                        <div class="label-item">
                            {{ item.label }}
                        </div>
                    </template>
                    <div class="content-item" v-if="item.content">{{ item.content }}</div>
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
@import '@/assets/css/_var.scss';

::v-deep .el-descriptions__cell.el-descriptions__label.is-bordered-label.is-right {
    background-color: transparent;
}

::v-deep .el-descriptions__cell.el-descriptions__label.is-bordered-label.is-right {
    width: 100px !important;
}

.label-item {
    color: $color6;
    width: 100px;
    font-size: $fontSize;
    height: $textHeight;
    line-height: $textHeight;

    &:hover {
        text-shadow: 0 0 5px $active-color, 0 0 5px $active-color,
    }
}

.content-item {
    color: $color3;
    font-size: $fontSize;
    background-color: $color7;
    text-align: left;
    position: relative;
    padding-left: 5px;
    margin-left: -10px;
    border: 1px dashed $color3;

    &:hover {
        font-size: larger;
        text-shadow: 0 0 5px $active-color, 0 0 5px $active-color,
    }
}
</style>
<style lang="scss"></style>

