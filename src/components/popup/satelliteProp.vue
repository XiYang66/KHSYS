<template>
    <div class="description">
        <el-collapse v-model="collapsedNames" @change="collapseChange" v-if="isCollapse">
            <el-form :model="dialogForm" label-width="120px" style="max-width: 1000px; margin: 10px auto">
                <el-collapse-item title="基本标识属性:" name="1">
                    <el-row :gutter="gutter">
                        <el-col :span="12" v-for="item in obj[select]">
                            <el-form-item :label="item.name">
                                <el-input v-model="item.value" :title="item.value" disabled />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-collapse-item>
                <el-collapse-item title="性能属性:" name="2">
                    <el-row :gutter="gutter">
                        <el-col :span="12" v-for="item in obj1[select]">
                            <el-form-item :label="item.name">
                                <el-input v-model="item.value" :title="item.value" disabled />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-collapse-item>
                <el-collapse-item title="物理特性:" name="3">
                    <el-row :gutter="gutter">
                        <el-col :span="12" v-for="item in obj2[select]">
                            <el-form-item :label="item.name">
                                <el-input v-model="item.value" :title="item.value" disabled />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-collapse-item>
            </el-form>
        </el-collapse>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const gutter = ref(20);//折叠项间距
const select = ref('')
const targets = ref([])
const collapsedNames = ref([])

// 六项表数据源
/**
 * @description:基本信息
 * */
const obj = ref([])
/**
 * @description:性能属性
 * */
const obj1 = ref([])
/**
 * @description:物理特性
 * */
const obj2 = ref([])
/**
 * @description:功能特性
 * */
const obj3 = ref([])
/**
 * @description:活动特性
 * */
const obj4 = ref([])
/**
 * @description:sb特性
 * */
const obj5 = ref([])
</script>

<style lang="scss" scoped></style>