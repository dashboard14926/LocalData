#### 环境配置

推荐使用 nvm

编辑器 vsCode

vite

vue-router

### 路由创建

创建路由和对应页面

引用 Vue-router 创建路由实例

对应页面使用 <Router-view> 配置路由显示

### UI 框架

按需引入:

首先你需要安装 unplugin-vue-components 和 unplugin-auto-import 这两款插件
npm install -D unplugin-vue-components unplugin-auto-import

// vite.config.ts
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
// ...
plugins: [
// ...
AutoImport({
resolvers: [ElementPlusResolver()],
}),
Components({
resolvers: [ElementPlusResolver()],
}),
],
})

### 页面 layout 布局

访问 Element UI 官网选择引入想要的布局效果

### aside 组件内容

通过 useRouter 来获取数据
使用递归组件实现有子菜单的
引入 element 图标 :
npm install @element-plus/icons-vue
import \* as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
app.component(key, component)
}

### header 组件内容

flex 弹性盒子,里面的 flex 小盒子自动按照大盒子位置排列
引入 vuex 实现组件通信
点击按钮展开收起菜单
tag 显示与删除逻辑
