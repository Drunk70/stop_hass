// 全局组件注册
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import Footer from './footer'
import ScreenFull from './ScreenFull'
import TagsView from './TagsView'
import LangSelect from './Lang'
import ThemePicker from './ThemePicker'
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload) // 注册图片上传组件
    Vue.component('Footer', Footer)
    Vue.component('ScreenFull', ScreenFull)
    Vue.component('TagsView', TagsView)
    Vue.component('LangSelect', LangSelect) // 完成组件的注册
    Vue.component('ThemePicker', ThemePicker) // 完成组件的注册
  }
}
