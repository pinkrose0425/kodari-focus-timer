import { useState } from 'react';

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    const addTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        const task = {
            id: Date.now(),
            text: newTask,
            completed: false
        };

        setTasks([...tasks, task]);
        setNewTask('');
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    return (
        <div className="flex flex-col w-full max-w-md p-6 rounded-[2rem] bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl mt-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                📝 Today's Focus
            </h2>

            <form onSubmit={addTask} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-1 px-4 py-2 rounded-xl bg-white/40 border-none placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-white text-rose-500 rounded-xl font-bold hover:scale-105 active:scale-95 transition-transform shadow-md"
                >
                    +
                </button>
            </form>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {tasks.length === 0 && (
                    <div className="text-center text-white/60 py-4 italic">
                        No tasks yet. Let's get to work! 🚀
                    </div>
                )}

                {tasks.map(task => (
                    <div
                        key={task.id}
                        className="group flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10"
                    >
                        <button
                            onClick={() => toggleTask(task.id)}
                            className="flex items-center gap-3 flex-1 text-left"
                        >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-400 border-emerald-400' : 'border-white/50'
                                }`}>
                                {task.completed && <span className="text-white text-sm">✓</span>}
                            </div>
                            <span className={`text-white font-medium transition-all ${task.completed ? 'line-through opacity-50' : ''
                                }`}>
                                {task.text}
                            </span>
                        </button>

                        <button
                            onClick={() => deleteTask(task.id)}
                            className="opacity-0 group-hover:opacity-100 p-2 text-white/50 hover:text-white hover:bg-rose-500/20 rounded-lg transition-all"
                            aria-label="Delete task"
                        >
                            🗑️
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodoList;
