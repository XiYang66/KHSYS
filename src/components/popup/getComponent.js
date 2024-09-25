export const getComponent_SatelliteProperties = () => defineComponent({
    name: 'SatelliteProperties',
    setup() {
        const satellite = reactive({
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
        });

        return () =>
            createVNode(
                'div',
                { class: 'satellite-properties' },
                [
                    createVNode(ElRow, null, [
                        createVNode(ElCol, { span: 12 }, [
                            h('div', { class: 'property' }, `卫星名称: ${satellite.name}`),
                            h('div', { class: 'property' }, `Norad-ID: ${satellite.noradId}`),
                            h('div', { class: 'property' }, `载荷类型: ${satellite.type}`),
                            h('div', { class: 'property' }, `国家: ${satellite.country}`)
                        ]),
                        createVNode(ElCol, { span: 12 }, [
                            h('div', { class: 'property' }, `TLE-1: ${satellite.tle1}`),
                            h('div', { class: 'property' }, `TLE-2: ${satellite.tle2}`)
                        ])
                    ]),
                    createVNode(ElDivider, null, '状态'),
                    h('div', { class: 'property' }, `卫星状态: ${satellite.status}`),
                    h('div', { class: 'property' }, `惯性系位置(Km): ${satellite.position}`),
                    h('div', { class: 'property' }, `惯性系速度(Km/s): ${satellite.velocity}`),
                    h('div', { class: 'property' }, `本体坐标系角度(312): ${satellite.coordinates}`),
                    h('div', { class: 'property' }, `姿态角速度(312): ${satellite.angularVelocity}`),
                    h('div', { class: 'property' }, [
                        h('span', null, '姿态控制开关: '),
                        createVNode(ElSwitch, {
                            modelValue: satellite.attitudeControl, 'onUpdate:modelValue': value => satellite.attitudeControl
                                = value
                        })
                    ]),
                    createVNode('div', { class: 'action-section' }, [
                        createVNode(ElButton, { type: 'primary' }, '轨迹追踪图像'),
                        createVNode(ElButton, { type: 'success' }, '格式显像图')
                    ])
                ]
            );
    }
});