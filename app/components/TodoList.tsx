"use client";

import { useState, useEffect } from "react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // 从本地存储加载
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      const parsed = JSON.parse(saved);
      setTodos(parsed.map((t: Todo) => ({ ...t, createdAt: new Date(t.createdAt) })));
    }
  }, []);

  // 保存到本地存储
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim() === "") return;
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date(),
    };
    
    setTodos([newTodo, ...todos]);
    setInputValue("");
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* 标题区域 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 bg-clip-text text-transparent mb-2">
          Todo List
        </h1>
        <p className="text-orange-600/70 text-sm">记录生活，从这里开始</p>
      </div>

      {/* 输入区域 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-orange-500/10 p-2 mb-6 border border-orange-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="添加新任务..."
            className="flex-1 px-4 py-3 rounded-xl bg-transparent text-gray-700 placeholder-gray-400 outline-none text-base"
          />
          <button
            onClick={addTodo}
            disabled={!inputValue.trim()}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-medium rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* 筛选标签 */}
      <div className="flex gap-2 mb-6 justify-center">
        {(["all", "active", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              filter === f
                ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/30"
                : "bg-white/60 text-gray-600 hover:bg-white hover:text-orange-600"
            }`}
          >
            {f === "all" ? "全部" : f === "active" ? "待办" : "已完成"}
            <span className={`ml-1.5 text-xs ${filter === f ? "text-white/80" : "text-gray-400"}`}>
              {f === "all" ? todos.length : f === "active" ? activeCount : completedCount}
            </span>
          </button>
        ))}
      </div>

      {/* 任务列表 */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <p className="text-gray-500">
              {filter === "all" ? "还没有任务，添加一个吧！" : 
               filter === "active" ? "没有待办任务，真棒！" : "还没有已完成的任务"}
            </p>
          </div>
        ) : (
          filteredTodos.map((todo, index) => (
            <div
              key={todo.id}
              className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-md border border-orange-50 hover:border-orange-200 transition-all duration-200 flex items-center gap-3 animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  todo.completed
                    ? "bg-gradient-to-r from-orange-500 to-rose-500 border-transparent"
                    : "border-orange-300 hover:border-orange-500"
                }`}
              >
                {todo.completed && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              
              <span
                className={`flex-1 text-base transition-all duration-200 ${
                  todo.completed
                    ? "text-gray-400 line-through"
                    : "text-gray-700"
                }`}
              >
                {todo.text}
              </span>
              
              <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* 底部统计 */}
      {todos.length > 0 && (
        <div className="mt-6 pt-4 border-t border-orange-100 flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {activeCount} 个待办任务
          </span>
          {completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="text-gray-500 hover:text-rose-500 transition-colors duration-200"
            >
              清除已完成
            </button>
          )}
        </div>
      )}
    </div>
  );
}
