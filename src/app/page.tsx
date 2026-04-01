import LuminaEditor from "../components/editor/Editor";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Lumina AI Editor</h1>
        <p className="text-gray-500 mt-2">下一代智能协同文档驱动引擎</p>
      </div>

      {/* 挂载编辑器组件 */}
      <LuminaEditor />
    </main>
  );
}