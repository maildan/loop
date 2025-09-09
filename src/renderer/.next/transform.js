const CHUNK_PUBLIC_PATH = "transform.js";
const runtime = require("./build/chunks/[turbopack]_runtime.js");
runtime.loadChunk("build/chunks/src_renderer_postcss_config_js_transform_ts_a2cb6fcd._.js");
runtime.loadChunk("build/chunks/[root-of-the-server]__b92d625e._.js");
runtime.getOrInstantiateRuntimeModule("[turbopack-node]/globals.ts [postcss] (ecmascript)", CHUNK_PUBLIC_PATH);
runtime.getOrInstantiateRuntimeModule("[turbopack-node]/ipc/evaluate.ts/evaluate.js { INNER => \"[project]/src/renderer/postcss.config.js/transform.ts { CONFIG => \\\"[project]/src/renderer/postcss.config.js_.loader.mjs [postcss] (ecmascript)\\\" } [postcss] (ecmascript)\", RUNTIME => \"[turbopack-node]/ipc/evaluate.ts [postcss] (ecmascript)\" } [postcss] (ecmascript)", CHUNK_PUBLIC_PATH);
module.exports = runtime.getOrInstantiateRuntimeModule("[turbopack-node]/ipc/evaluate.ts/evaluate.js { INNER => \"[project]/src/renderer/postcss.config.js/transform.ts { CONFIG => \\\"[project]/src/renderer/postcss.config.js_.loader.mjs [postcss] (ecmascript)\\\" } [postcss] (ecmascript)\", RUNTIME => \"[turbopack-node]/ipc/evaluate.ts [postcss] (ecmascript)\" } [postcss] (ecmascript)", CHUNK_PUBLIC_PATH).exports;
