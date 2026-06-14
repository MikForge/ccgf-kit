'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOOTSTRAP_PROMPT_TEXT = void 0;
exports.buildSceneJson = buildSceneJson;
/** 生成唯一占位 ID（基于场景名 + 标识符） */
function makeId(sceneName, tag) {
    return `${sceneName}-${tag}-${Date.now()}`;
}
/** 创建默认 Vec3 值 */
function vec3(x, y, z) {
    return { __type__: 'cc.Vec3', x, y, z };
}
/** 创建默认 Quat 值 */
function quat(x, y, z, w) {
    return { __type__: 'cc.Quat', x, y, z, w };
}
/** 创建默认 Vec3 euler */
function euler(x, y, z) {
    return { __type__: 'cc.Vec3', x, y, z };
}
/** 构建节点基础字段 */
function baseNode(name, id) {
    return {
        _name: name,
        _objFlags: 0,
        __editorExtras__: {},
        _active: true,
        _components: [],
        _prefab: null,
        _lpos: vec3(0, 0, 0),
        _lrot: quat(0, 0, 0, 1),
        _lscale: vec3(1, 1, 1),
        _mobility: 0,
        _euler: euler(0, 0, 0),
        _id: id,
    };
}
/**
 * 生成符合 Main.ts 要求的启动场景 JSON 字符串。
 *
 * 包含节点树：root → game, gui → UICamera
 * 内置组件：Canvas, UITransform, Widget, Camera
 * 不含任何用户脚本组件。
 *
 * @param sceneName 场景名称（不含 .scene 扩展名）
 * @returns 场景 JSON 字符串
 */
function buildSceneJson(sceneName) {
    // ======== 索引映射 ========
    // 0: SceneAsset
    // 1: Scene
    // 2: root Node
    // 3: game Node
    // 4: gui Node
    // 5: UICamera Node
    // 6: UITransform (on gui)
    // 7: Canvas (on gui)
    // 8: Widget (on gui)
    // 9: Camera (on UICamera)
    // 10: PrefabInfo
    // 11: SceneGlobals
    // 12: AmbientInfo
    // 13: ShadowsInfo
    // 14: SkyboxInfo
    // 15: FogInfo
    // 16: OctreeInfo
    // 17: SkinInfo
    // 18: LightProbeInfo
    // 19: PostSettingsInfo
    const GAME_LAYER = 1073741824;
    const UI_LAYER = 33554432;
    const scene = [
        // [0] SceneAsset
        {
            __type__: 'cc.SceneAsset',
            _name: sceneName,
            _objFlags: 0,
            __editorExtras__: {},
            _native: '',
            scene: { __id__: 1 },
        },
        // [1] Scene
        {
            __type__: 'cc.Scene',
            _name: sceneName,
            _objFlags: 0,
            __editorExtras__: {},
            _parent: null,
            _children: [{ __id__: 2 }],
            _active: true,
            _components: [],
            _prefab: { __id__: 10 },
            _lpos: vec3(0, 0, 0),
            _lrot: quat(0, 0, 0, 1),
            _lscale: vec3(1, 1, 1),
            _mobility: 0,
            _layer: GAME_LAYER,
            _euler: euler(0, 0, 0),
            autoReleaseAssets: false,
            _globals: { __id__: 11 },
            _id: makeId(sceneName, 'scene'),
        },
        // [2] root Node
        {
            __type__: 'cc.Node',
            ...baseNode('root', makeId(sceneName, 'root')),
            _parent: { __id__: 1 },
            _children: [{ __id__: 3 }, { __id__: 4 }],
            _layer: GAME_LAYER,
        },
        // [3] game Node
        {
            __type__: 'cc.Node',
            ...baseNode('game', makeId(sceneName, 'game')),
            _parent: { __id__: 2 },
            _children: [],
            _layer: GAME_LAYER,
        },
        // [4] gui Node
        {
            __type__: 'cc.Node',
            ...baseNode('gui', makeId(sceneName, 'gui')),
            _parent: { __id__: 2 },
            _children: [{ __id__: 5 }],
            _components: [{ __id__: 6 }, { __id__: 7 }, { __id__: 8 }],
            _lpos: vec3(640, 360.00000000000006, 0),
            _layer: UI_LAYER,
        },
        // [5] UICamera Node
        {
            __type__: 'cc.Node',
            ...baseNode('UICamera', makeId(sceneName, 'uicamera')),
            _parent: { __id__: 4 },
            _children: [],
            _components: [{ __id__: 9 }],
            _lpos: vec3(0, 0, 1000),
            _layer: GAME_LAYER,
        },
        // [6] UITransform on gui
        {
            __type__: 'cc.UITransform',
            _name: '',
            _objFlags: 0,
            __editorExtras__: {},
            node: { __id__: 4 },
            _enabled: true,
            __prefab: null,
            _contentSize: { __type__: 'cc.Size', width: 1280, height: 720 },
            _anchorPoint: { __type__: 'cc.Vec2', x: 0.5, y: 0.5 },
            _id: makeId(sceneName, 'uitransform'),
        },
        // [7] Canvas on gui
        {
            __type__: 'cc.Canvas',
            _name: '',
            _objFlags: 0,
            __editorExtras__: {},
            node: { __id__: 4 },
            _enabled: true,
            __prefab: null,
            _cameraComponent: { __id__: 9 },
            _alignCanvasWithScreen: true,
            _id: makeId(sceneName, 'canvas'),
        },
        // [8] Widget on gui
        {
            __type__: 'cc.Widget',
            _name: '',
            _objFlags: 0,
            __editorExtras__: {},
            node: { __id__: 4 },
            _enabled: true,
            __prefab: null,
            _alignFlags: 45,
            _target: null,
            _left: 0,
            _right: 0,
            _top: 5.684341886080802e-14,
            _bottom: 5.684341886080802e-14,
            _horizontalCenter: 0,
            _verticalCenter: 0,
            _isAbsLeft: true,
            _isAbsRight: true,
            _isAbsTop: true,
            _isAbsBottom: true,
            _isAbsHorizontalCenter: true,
            _isAbsVerticalCenter: true,
            _originalWidth: 0,
            _originalHeight: 0,
            _alignMode: 2,
            _lockFlags: 0,
            _id: makeId(sceneName, 'widget'),
        },
        // [9] Camera on UICamera
        {
            __type__: 'cc.Camera',
            _name: '',
            _objFlags: 0,
            __editorExtras__: {},
            node: { __id__: 5 },
            _enabled: true,
            __prefab: null,
            _projection: 0,
            _priority: 0,
            _fov: 45,
            _fovAxis: 0,
            _orthoHeight: 360,
            _near: 0,
            _far: 2000,
            _color: { __type__: 'cc.Color', r: 0, g: 0, b: 0, a: 255 },
            _depth: 1,
            _stencil: 0,
            _clearFlags: 7,
            _rect: { __type__: 'cc.Rect', x: 0, y: 0, width: 1, height: 1 },
            _aperture: 19,
            _shutter: 7,
            _iso: 0,
            _screenScale: 1,
            _visibility: 1108344832,
            _targetTexture: null,
            _postProcess: null,
            _usePostProcess: false,
            _cameraType: -1,
            _trackingType: 0,
            _id: makeId(sceneName, 'camera'),
        },
        // [10] PrefabInfo
        {
            __type__: 'cc.PrefabInfo',
            root: null,
            asset: null,
            fileId: makeId(sceneName, 'scene'),
            instance: null,
            targetOverrides: null,
        },
        // [11] SceneGlobals
        {
            __type__: 'cc.SceneGlobals',
            ambient: { __id__: 12 },
            shadows: { __id__: 13 },
            _skybox: { __id__: 14 },
            fog: { __id__: 15 },
            octree: { __id__: 16 },
            skin: { __id__: 17 },
            lightProbeInfo: { __id__: 18 },
            postSettings: { __id__: 19 },
            bakedWithStationaryMainLight: false,
            bakedWithHighpLightmap: false,
        },
        // [12] AmbientInfo
        {
            __type__: 'cc.AmbientInfo',
            _skyColorHDR: { __type__: 'cc.Vec4', x: 0, y: 0, z: 0, w: 0.520833125 },
            _skyColor: { __type__: 'cc.Vec4', x: 0, y: 0, z: 0, w: 0.520833125 },
            _skyIllumHDR: 20000,
            _skyIllum: 20000,
            _groundAlbedoHDR: { __type__: 'cc.Vec4', x: 0, y: 0, z: 0, w: 0 },
            _groundAlbedo: { __type__: 'cc.Vec4', x: 0, y: 0, z: 0, w: 0 },
            _skyColorLDR: { __type__: 'cc.Vec4', x: 0.2, y: 0.5, z: 0.8, w: 1 },
            _skyIllumLDR: 20000,
            _groundAlbedoLDR: { __type__: 'cc.Vec4', x: 0.2, y: 0.2, z: 0.2, w: 1 },
        },
        // [13] ShadowsInfo
        {
            __type__: 'cc.ShadowsInfo',
            _enabled: false,
            _type: 0,
            _normal: { __type__: 'cc.Vec3', x: 0, y: 1, z: 0 },
            _distance: 0,
            _planeBias: 1,
            _shadowColor: { __type__: 'cc.Color', r: 76, g: 76, b: 76, a: 255 },
            _maxReceived: 4,
            _size: { __type__: 'cc.Vec2', x: 512, y: 512 },
        },
        // [14] SkyboxInfo
        {
            __type__: 'cc.SkyboxInfo',
            _envLightingType: 0,
            _envmapHDR: null,
            _envmap: null,
            _envmapLDR: null,
            _diffuseMapHDR: null,
            _diffuseMapLDR: null,
            _enabled: false,
            _useHDR: true,
            _editableMaterial: null,
            _reflectionHDR: null,
            _reflectionLDR: null,
            _rotationAngle: 0,
        },
        // [15] FogInfo
        {
            __type__: 'cc.FogInfo',
            _type: 0,
            _fogColor: { __type__: 'cc.Color', r: 200, g: 200, b: 200, a: 255 },
            _enabled: false,
            _fogDensity: 0.3,
            _fogStart: 0.5,
            _fogEnd: 300,
            _fogAtten: 5,
            _fogTop: 1.5,
            _fogRange: 1.2,
            _accurate: false,
        },
        // [16] OctreeInfo
        {
            __type__: 'cc.OctreeInfo',
            _enabled: false,
            _minPos: { __type__: 'cc.Vec3', x: -1024, y: -1024, z: -1024 },
            _maxPos: { __type__: 'cc.Vec3', x: 1024, y: 1024, z: 1024 },
            _depth: 8,
        },
        // [17] SkinInfo
        {
            __type__: 'cc.SkinInfo',
            _enabled: false,
            _blurRadius: 0.01,
            _sssIntensity: 3,
        },
        // [18] LightProbeInfo
        {
            __type__: 'cc.LightProbeInfo',
            _giScale: 1,
            _giSamples: 1024,
            _bounces: 2,
            _reduceRinging: 0,
            _showProbe: true,
            _showWireframe: true,
            _showConvex: false,
            _data: null,
            _lightProbeSphereVolume: 1,
        },
        // [19] PostSettingsInfo
        {
            __type__: 'cc.PostSettingsInfo',
            _toneMappingType: 0,
        },
    ];
    return JSON.stringify(scene);
}
/** 场景生成成功后的操作指引文本 */
exports.BOOTSTRAP_PROMPT_TEXT = [
    '场景已创建。请手动完成以下步骤：',
    '',
    '1. 将 Main.ts 拖到 root 节点上',
    '2. 将 game 子节点拖入 Main 组件的 gameRoot 属性',
    '3. 将 gui 子节点拖入 Main 组件的 uiRoot 属性',
].join('\n');
