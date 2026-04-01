import { Editor } from '@tiptap/react'
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Quote,
    Undo,
    Redo
} from 'lucide-react'

// 定义 Toolbar 接收的 props
interface ToolbarProps {
    editor: Editor | null
}

export default function Toolbar({ editor }: ToolbarProps) {
    if (!editor) {
        return null
    }

    // 一个通用的小按钮组件，让代码更整洁
    const ToolButton = ({
        onClick,
        isActive,
        children
    }: {
        onClick: () => void,
        isActive: boolean,
        children: React.ReactNode
    }) => (
        <button
            onClick={(e) => {
                e.preventDefault(); // 防止点击时编辑器失去焦点
                onClick();
            }}
            className={`p-2 rounded-md transition-colors ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-200'
                }`}
        >
            {children}
        </button>
    )

    return (
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 bg-gray-50 p-2 px-4">
            {/* 基础文本格式 */}
            <ToolButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
            >
                <Bold size={18} />
            </ToolButton>

            <ToolButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
            >
                <Italic size={18} />
            </ToolButton>

            <ToolButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
            >
                <Strikethrough size={18} />
            </ToolButton>

            <ToolButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                isActive={editor.isActive('code')}
            >
                <Code size={18} />
            </ToolButton>

            <div className="w-px h-6 bg-gray-300 mx-2"></div> {/* 分割线 */}

            {/* 标题与区块 */}
            <ToolButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
            >
                <Heading1 size={18} />
            </ToolButton>

            <ToolButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
            >
                <Heading2 size={18} />
            </ToolButton>

            <ToolButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
            >
                <Quote size={18} />
            </ToolButton>

            <div className="flex-grow"></div> {/* 将撤销重做推到最右侧 */}

            <ToolButton
                onClick={() => editor.chain().focus().undo().run()}
                isActive={false}
            >
                <Undo size={18} />
            </ToolButton>

            <ToolButton
                onClick={() => editor.chain().focus().redo().run()}
                isActive={false}
            >
                <Redo size={18} />
            </ToolButton>
        </div>
    )
}