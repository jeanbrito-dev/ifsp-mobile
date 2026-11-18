* Unmerged path babel.config.js
[1mdiff --git a/babel.config.js b/babel.config.js[m
[1mindex 26fbbc1..ecca9c0 100644[m
[1m--- a/babel.config.js[m
[1m+++ b/babel.config.js[m
[36m@@ -1,3 +1,11 @@[m
[32m+[m[32m<<<<<<< HEAD[m
[32m+[m[32mmodule.exports = function (api) {[m
[32m+[m[32m  api.cache(true);[m
[32m+[m[32m  return {[m
[32m+[m[32m    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],[m
[32m+[m[32m  };[m
[32m+[m[32m};[m
[32m+[m[32m=======[m
 [m
 module.exports = function (api) {[m
   api.cache(true);[m
[36m@@ -6,3 +14,4 @@[m [mmodule.exports = function (api) {[m
     presets: ["babel-preset-expo"],[m
   };[m
 };[m
[32m+[m[32m>>>>>>> develop[m
