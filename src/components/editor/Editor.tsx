'use client'

import React, { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Sparkles, Loader2, Cpu } from 'lucide-react'
import Toolbar from './Toolbar'
import { SlashMenu } from './extensions/slash-menu/extension'
import suggestion from './extensions/slash-menu/suggestion'

export default function LuminaEditor() {
    const [aiPrompt, setAiPrompt] = useState('')
    const [isAiLoading, setIsAiLoading] = useState(false)
    const [showAiInput, setShowAiInput] = useState(false)

    // 新增：当前选择的模型
    const [selectedProvider, setSelectedProvider] = useState('kimi')

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: '输入 "/" 唤起 AI 助手，或直接开始写作...',
                emptyEditorClass: 'is-editor-empty',
            }),
            SlashMenu.configure({
                suggestion: {
                    ...suggestion,
                    command: ({ editor, range, props }: any) => {
                        if (props.title === '✨ AI 智能助手') {
                            editor.chain().focus().deleteRange(range).run()
                            setShowAiInput(true)
                        } else {
                            props.command({ editor, range })
                        }
                    }
                },
            }),
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[500px] text-gray-700',
            },
        },
    })

    const handleAiSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!aiPrompt.trim() || !editor) return

        setIsAiLoading(true)
        setShowAiInput(false)
        const currentPrompt = aiPrompt
        setAiPrompt('')

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // 新增：把选中的模型名字传给后端！
                body: JSON.stringify({ prompt: currentPrompt, provider: selectedProvider }),
            })

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`请求失败 (${response.status}): ${errText}`)
            }
            if (!response.body) throw new Error('没有获取到数据流')

            const reader = response.body.getReader()
            const decoder = new TextDecoder('utf-8')

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value, { stream: true })
                const lines = chunk.split('\n')

                for (const line of lines) {
                    if (line.startsWith('data: ') && !line.includes('[DONE]')) {
                        try {
                            const jsonString = line.slice(6)
                            const data = JSON.parse(jsonString)
                            const text = data.choices[0]?.delta?.content || ''

                            if (text) {
                                editor.chain().focus().insertContent(text).run()
                            }
                        } catch (e) {
                            // 忽略截断报错
                        }
                    }
                }
            }
        } catch (error: any) {
            console.error('AI 生成出错:', error)
            alert(`调用 ${selectedProvider} 失败: \n${error.message}`)
        } finally {
            setIsAiLoading(false)
        }
    }

    if (!editor) return null

    return (
        <div className="w-full max-w-4xl mx-auto mt-10 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden relative">
            <div className="bg-gray-800 p-2 text-sm text-gray-200 font-medium px-4 flex items-center justify-between">
                <span>Lumina Editor</span>
                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full border border-purple-500/30">
                    Multi-Model Gateway Active
                </span>
            </div>

            <Toolbar editor={editor} />

            {showAiInput && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white shadow-2xl rounded-xl border border-indigo-100 p-3 z-50 flex items-center gap-3">
                    <Sparkles className="text-indigo-500" size={20} />

                    {/* 新增：模型切换下拉框 */}
                    <div className="flex items-center bg-gray-50 rounded-md px-2 py-1 border border-gray-200">
                        <Cpu size={14} className="text-gray-500 mr-1" />
                        <select
                            value={selectedProvider}
                            onChange={(e) => setSelectedProvider(e.target.value)}
                            className="bg-transparent text-xs font-medium text-gray-700 outline-none cursor-pointer"
                        >
                            <option value="kimi">Kimi (Moonshot)</option>
                            <option value="google">Google Gemini</option>
                            <option value="openai">OpenAI (GPT-3.5)</option>
                            <option value="deepseek">DeepSeek</option>
                        </select>
                    </div>

                    <form onSubmit={handleAiSubmit} className="flex-1 flex gap-2">
                        <input
                            type="text"
                            autoFocus
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder={`告诉 ${selectedProvider} 你想写什么...`}
                            className="flex-1 outline-none text-sm px-2 py-1 text-gray-700 bg-transparent"
                        />
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                            生成
                        </button>
                    </form>
                    <button onClick={() => setShowAiInput(false)} className="text-gray-400 hover:text-gray-600 px-1">
                        ✕
                    </button>
                </div>
            )}

            {isAiLoading && (
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur shadow-lg rounded-full px-4 py-2 border border-gray-100 flex items-center gap-2 text-sm text-indigo-600 font-medium z-50">
                    <Loader2 className="animate-spin" size={16} />
                    {selectedProvider} 正在思考中...
                </div>
            )}

            <div className="p-4 cursor-text">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}