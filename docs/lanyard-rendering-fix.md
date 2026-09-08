# Lanyard rendering investigation · 2026-09-08

## 已确认的现象与限制

**开发模式主因已复现并验证修复：Canvas lifecycle / Suspense。** Production 下通过测试，但在 Next dev 下，独立 Playwright 浏览器和实际 Codex 预览均在初次加载及手动重载后进入 Context Lost。给 Canvas 内的异步 Physics/GLTF/Environment 添加局部 `Suspense fallback={null}` 后，独立浏览器 8 秒检查与实际预览均保持 `ready=true`、`context-lost=false`。之前异步加载向 Canvas 外传播 Suspense，触发 Canvas 生命周期清理；库的清理函数在 500ms 后执行 `forceContextLoss()`。局部 boundary 保持 Canvas 存活，让资源在内部等待。

用户日志包含 `THREE.WebGLRenderer: Context Lost`。这说明 WebGL context 丢失或被释放，不能据此独立判断 GPU 崩溃。当前安装的 React Three Fiber 在 Canvas unmount 清理时会调用 `forceContextLoss()`；因此开发模式 Fast Refresh、组件卸载，也可能产生相同日志。日志不足以区分这些原因与浏览器/GPU 资源问题。

`ObjectMultiplex` 来自 `contentscript.js`，看起来是浏览器扩展通信；没有证据说明它导致卡片消失。`THREE.Clock` 和 Rapier initialization 的 deprecated 警告属于依赖 API 警告，不能直接当成渲染失败原因。本次没有靠隐藏 console warning 掩盖问题。

## 代码中发现并修正的问题

- **Transform synchronization**：绑带原来从 raw physics pose 和另一个平滑位置混合计算末端，但卡扣按 Rapier interpolated transform 绘制。现在 Physics 在 priority -1 更新，绑带在之后使用卡扣实际的 world matrix，避免连接处错帧。
- **Interpolation overshoot**：旧系数 `delta * speed` 在帧间隔较大时可能超过 1，使平滑反向过冲。现在采用有界 exponential smoothing，并限制恢复后的时间步影响。
- **Depth overlap**：绑带末端移到金属环后方；透明绑带不写入 depth buffer，透明像素通过 alpha test 排除，减少连接处深度交叠。这是针对闪烁风险的修正，并非仅凭静态截图就确认了所有 GPU 上的 z-fighting。
- **Viewport clipping**：逐帧图中确认旧 swing impulse 会把卡片部分甩出 Canvas。按钮现在设置较小、固定的 velocity，重复点击不会持续叠加 impulse。
- **Context recovery**：保留 Canvas，监听原生 lost/restored 事件。丢失时暂停渲染并显示文字状态；恢复后重新绘制。浏览器未恢复或资源加载失败时可用 Reload 3D card 重新创建 renderer，并清除失败的资源缓存。
- **No image fallback**：已删除 `img.lanyard-fallback` 和对应 CSS；不会使用另一张照片替代 WebGL 画面。About Me 的独立照片不受影响。

## 验证

Production build 在最后一次局部 Suspense 调整前通过；最终源码另外进行了 TypeScript 检查和开发模式真实浏览器回归。`scripts/lanyard-recovery-qa.cjs` 在真实 Chromium、desktop 与 mobile DPR 2 模拟环境测试 12 帧连续截图、摆动、350 ms main-thread stall、真实 WEBGL_lose_context 丢失/恢复、手动重载、资源加载失败后重试。截图已人工查看。`scripts/glb-qa.cjs` 另测 reduced motion、keyboard swing 和 touch cancellation。

最新专项证据：`artifacts/visual-qa/lanyard-recovery-report.json`、`glb-report.json`、`lanyard-stability-desktop.png`、`lanyard-stability-mobile.png`、`lanyard-recovery-desktop.webm`、`lanyard-recovery-mobile.webm`。先前的整页 walkthrough 和整页 QA 属于之前版本，不代替本次专项回归。测试可验证恢复路径，不能保证用户 GPU 驱动永不再次丢失 context。


## Follow-up: moving ribbon flicker

The user reported continuing ribbon flicker despite the earlier context-loss fix. Those are separate failure modes; the previous tests mostly checked card visibility and were insufficient to establish ribbon stability under repeated dragging.

Replaced screen-space MeshLine with a preallocated solid rectangular RibbonGeometry, double-sided opaque MeshBasicMaterial and real world-space depth. This removes the screen-space miter normal and transparent sorting paths from ribbon rendering. All curve points now come from the same interpolated render transforms; removed the extra lag filter on intermediate physics nodes and use a centripetal curve. Geometry buffers are reused rather than allocated every frame. The photo material was preserved as currently configured by the user.

The revised browser regression uses repeated left/right/up/down drag reversals, release and a 350 ms main-thread stall on desktop and mobile DPR2. It checks both card visibility and absence of blank ribbon scanlines in the upper 60 CSS pixels across all 12 captured frames per viewport. Contact sheets are manually inspected. This is stronger than the earlier gentle-swing check, but does not claim exhaustive coverage of every GPU or every possible fold.
