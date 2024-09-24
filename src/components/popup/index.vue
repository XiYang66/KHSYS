<template>
    <div>
        <el-tabs v-model="activeTab">
            <el-tab-pane label="卫星属性" name="properties">
                <div class="satellite-properties">
                    <!-- Properties Section -->
                    <el-row>
                        <el-col :span="12">
                            <div class="property">
                                <span>卫星名称:</span> {{ satellite.name }}
                            </div>
                            <div class="property">
                                <span>Norad-ID:</span> {{ satellite.noradId }}
                            </div>
                            <div class="property">
                                <span>载荷类型:</span> {{ satellite.type }}
                            </div>
                            <div class="property">
                                <span>国家:</span> {{ satellite.country }}
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="property">
                                <span>TLE-1:</span> {{ satellite.tle1 }}
                            </div>
                            <div class="property">
                                <span>TLE-2:</span> {{ satellite.tle2 }}
                            </div>
                        </el-col>
                    </el-row>

                    <!-- Status Section -->
                    <div class="status-section">
                        <el-divider>状态</el-divider>
                        <div class="property">
                            <span>卫星状态:</span> {{ satellite.status }}
                        </div>
                        <div class="property">
                            <span>惯性系位置(Km):</span> {{ satellite.position }}
                        </div>
                        <div class="property">
                            <span>惯性系速度(Km/s):</span> {{ satellite.velocity }}
                        </div>
                        <div class="property">
                            <span>本体坐标系角度(312):</span> {{ satellite.coordinates }}
                        </div>
                        <div class="property">
                            <span>姿态角速度(312):</span> {{ satellite.angularVelocity }}
                        </div>
                        <div class="property">
                            <span>姿态控制开关:</span>
                            <el-switch v-model="satellite.attitudeControl"></el-switch>
                        </div>
                    </div>

                    <!-- Action Section -->
                    <div class="action-section">
                        <el-button type="primary">轨迹追踪图像</el-button>
                        <el-button type="success">格式显像图</el-button>
                    </div>
                </div>
            </el-tab-pane>

            <el-tab-pane label="故障说明" name="fault-explanation"></el-tab-pane>
            <el-tab-pane label="任务管理" name="task-management"></el-tab-pane>
            <el-tab-pane label="载荷属性" name="payload-properties"></el-tab-pane>
            <el-tab-pane label="载荷数据" name="payload-data"></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>

const visible = true,
    activeTab = 'properties',
    satellite = {
        name: '尖兵十三号03星',
        noradId: '99906',
        type: 'SAR',
        country: '中国',
        tle1: '1 99906U 21236 0000000 00004175 00000-0 52744-3 0',
        tle2: '1 99906U 21236 0000000 00004175 00000-0 52744-3 0',
        status: '正常',
        position: '-1275.93, -3747.65, 5683.59',
        velocity: '(20.6, 31.4, 20.4)',
        coordinates: '(00.0, 00.0, 00.0)',
        angularVelocity: '(00.0, 00.0, 00.0)',
        attitudeControl: false,
    }

</script>

<style lang="scss" scoped></style>