import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'

export const CommandList = forwardRef((props: any, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    // 点击或回车执行命令
    const selectItem = (index: number) => {
        const item = props.items[index]
        if (item) {
            props.command(item)
        }
    }

    // 键盘事件处理
    const upHandler = () => setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
    const downHandler = () => setSelectedIndex((selectedIndex + 1) % props.items.length)
    const enterHandler = () => selectItem(selectedIndex)

    useEffect(() => setSelectedIndex(0), [props.items])

    // 将键盘事件暴露给外部的 TipTap 引擎
    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: any) => {
            if (event.key === 'ArrowUp') { upHandler(); return true }
            if (event.key === 'ArrowDown') { downHandler(); return true }
            if (event.key === 'Enter') { enterHandler(); return true }
            return false
        },
    }))

    return (
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2 w-64 flex flex-col z-50">
            <div className="px-3 py-1 text-xs font-semibold text-gray-400 mb-1">基础块 & AI</div>
            {props.items.length ? (
                props.items.map((item: any, index: number) => (
                    <button
                        className={`flex items-center px-4 py-2 text-sm text-left transition-colors ${index === selectedIndex ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        key={index}
                        onClick={() => selectItem(index)}
                    >
                        <span className="mr-3 text-lg">{item.icon}</span>
                        {item.title}
                    </button>
                ))
            ) : (
                <div className="px-4 py-2 text-sm text-gray-500">无匹配项...</div>
            )}
        </div>
    )
})
CommandList.displayName = 'CommandList'