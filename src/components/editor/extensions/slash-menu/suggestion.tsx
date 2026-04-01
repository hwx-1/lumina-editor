import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import { CommandList } from './CommandList'

export default {
    // 定义菜单里的选项
    items: ({ query }: { query: string }) => {
        return [
            {
                title: '✨ AI 智能助手',
                icon: '🤖',
                command: ({ editor, range }: any) => {
                    editor.chain().focus().deleteRange(range).run()
                    // 这里是我们下一阶段接入大模型流式对话的入口！
                    alert('🚀 准备接入 AI Agent！(阶段 4)')
                },
            },
            {
                title: '一级标题',
                icon: 'H1',
                command: ({ editor, range }: any) => {
                    editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
                },
            },
            {
                title: '代码块',
                icon: '💻',
                command: ({ editor, range }: any) => {
                    editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
                },
            },
        ].filter(item => item.title.toLowerCase().startsWith(query.toLowerCase())).slice(0, 10)
    },

    // 渲染逻辑：把 React 挂载到 Tippy 弹窗上
    render: () => {
        let component: any
        let popup: any

        return {
            onStart: (props: any) => {
                component = new ReactRenderer(CommandList, {
                    props,
                    editor: props.editor,
                })

                if (!props.clientRect) return

                popup = tippy('body', {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                })
            },
            onUpdate(props: any) {
                component.updateProps(props)
                if (!props.clientRect) return
                popup[0].setProps({ getReferenceClientRect: props.clientRect })
            },
            onKeyDown(props: any) {
                if (props.event.key === 'Escape') {
                    popup[0].hide()
                    return true
                }
                return component.ref?.onKeyDown(props)
            },
            onExit() {
                popup[0].destroy()
                component.destroy()
            },
        }
    },
}