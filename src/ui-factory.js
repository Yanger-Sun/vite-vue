/**
 * ui 组件工厂，所有需要用到的组件可在此注册
 * element-plus 组件库组件注册
 * 自定义组件注册
 */
// import { use } from 'element-plus/es/locale/index';
// import zhcn from 'dayjs/locale/zh-cn';
// import './assets/styles/theme/element-variables.scss';
// import './assets/styles/theme/var.css'
// import globalComponents from '@/components/global-component'; // 自定义组件
// import directives from '@/directives'; // 自定义指令
// import 'element-plus/dist/index.css';

import {
    ElAffix,
    // ElAlert,
    ElAside,
    // ElAutocomplete,
    // ElAvatar,
    // ElBacktop,
    ElBadge,
    ElBreadcrumb,
    ElBreadcrumbItem,
    ElButton,
    // ElButtonGroup,
    // ElCalendar,
    ElCard,
    ElCarousel,
    ElCarouselItem,
    ElCascader,
    ElCascaderPanel,
    ElCheckbox,
    // ElCheckboxButton,
    ElCheckboxGroup,
    ElCol,
    // ElCollapse,
    // ElCollapseItem,
    // ElCollapseTransition,
    ElColorPicker,
    ElContainer,
    ElDatePicker,
    ElDialog,
    ElDivider,
    ElDrawer,
    ElDropdown,
    ElDropdownItem,
    ElDropdownMenu,
    ElEmpty,
    // ElFooter,
    ElForm,
    ElFormItem,
    ElHeader,
    ElIcon,
    ElImage,
    ElInput,
    ElInputNumber,
    ElLink,
    ElMain,
    ElMenu,
    ElMenuItem,
    // ElMenuItemGroup,
    ElOption,
    // ElOptionGroup,
    // ElPageHeader,
    ElPagination,
    // ElPopconfirm,
    ElPopover,
    // ElPopper,
    ElProgress,
    ElRadio,
    // ElRadioButton,
    ElRadioGroup,
    ElRate,
    ElResult,
    ElRow,
    // ElScrollbar,
    ElSelect,
    // ElSlider,
    // ElStep,
    // ElSteps,
    ElSubMenu,
    ElSwitch,
    ElTabPane,
    ElTable,
    ElTableColumn,
    ElTabs,
    ElTag,
    ElTimePicker,
    // ElTimeSelect,
    // ElTimeline,
    // ElTimelineItem,
    ElTooltip,
    // ElTransfer,
    ElTree,
    ElUpload,
    ElInfiniteScroll,
    ElLoading,
    ElMessage,
    ElMessageBox
    // ElNotification,
} from 'element-plus';

const components = [
    ElAffix,
    // ElAlert,
    ElAside,
    // ElAutocomplete,
    // ElAvatar,
    // ElBacktop,
    ElBadge,
    ElBreadcrumb,
    ElBreadcrumbItem,
    ElButton,
    // ElButtonGroup,
    // ElCalendar,
    ElCard,
    ElCarousel,
    ElCarouselItem,
    ElCascader,
    ElCascaderPanel,
    ElCheckbox,
    // ElCheckboxButton,
    ElCheckboxGroup,
    ElCol,
    // ElCollapse,
    // ElCollapseItem,
    // ElCollapseTransition,
    ElColorPicker,
    ElContainer,
    ElDatePicker,
    ElDialog,
    ElDivider,
    ElDrawer,
    ElDropdown,
    ElDropdownItem,
    ElDropdownMenu,
    ElEmpty,
    // ElFooter,
    ElForm,
    ElFormItem,
    ElHeader,
    ElIcon,
    ElImage,
    ElInput,
    ElInputNumber,
    ElLink,
    ElMain,
    ElMenu,
    ElMenuItem,
    // ElMenuItemGroup,
    ElOption,
    // ElOptionGroup,
    // ElPageHeader,
    ElPagination,
    // ElPopconfirm,
    ElPopover,
    // ElPopper,
    ElProgress,
    ElRadio,
    // ElRadioButton,
    ElRadioGroup,
    ElRate,
    ElRow,
    ElResult,
    // ElScrollbar,
    ElSelect,
    // ElSlider,
    // ElStep,
    // ElSteps,
    ElSubMenu,
    ElSwitch,
    ElTabPane,
    ElTable,
    ElTableColumn,
    ElTabs,
    ElTag,
    ElTimePicker,
    // ElTimeSelect,
    // ElTimeline,
    // ElTimelineItem,
    ElTooltip,
    // ElTransfer,
    ElTree,
    ElUpload,
    ElMessage
    // ...globalComponents
]
  
const plugins = [
    ElInfiniteScroll,
    ElLoading,
    // ElMessage, // 不起作用
    ElMessageBox
    // ElNotification,
]

export default {
    /**
     * 注册按需引入使用到的组件
     * @param {object} app vue的createApp 实例
     */
    register(app) {
        // 设置语言
        // use(zhcn);

        // 组件库注册
        components.forEach(component => {
            app.component(component.name, component)
        });
        plugins.forEach(plugin => {
            app.use(plugin);
        });
        
        // 注册directive
        // for (let key in directives) {
        //     app.directive(key, (el, binding)=>{
        //         directives[key](el, binding);
        //     })
        // }
        return app;
    }
}
