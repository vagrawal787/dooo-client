import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Homepage.css';

interface Props { }

const App: React.FC<Props> = () => {
    const [ventInput, setVentInput] = useState<string>('');
    const [ventMessages, setVentMessages] = useState<string[]>([])
    const [todoInput, setTodoInput] = useState<string>('');
    const [longTermInput, setLongTermInput] = useState<string>('');
    const [todos, setTodos] = useState<{ 'text': string, 'completed': boolean, 'label': string }[]>([{ 'text': 'hello', 'completed': false, 'label': 'Loading...' }]);
    const [longTermTasks, setLongTermTasks] = useState<string[]>([]);

    const handleVentInputKey: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.key === 'Enter' && ventInput.trim() !== '') {
            setVentMessages((prevMessages) => [...prevMessages, ventInput])
            setVentInput('')
            const headers = { 'Content-Type': 'application/json' }
            let data = {
                "chat": {
                    "role": "user", "content": ventInput
                }
            }
            let response = fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: headers,
                body: JSON.stringify(data)
            }).then(response => {
                return response.json()
            }).then((data) => {
                setVentMessages((prevMessages) => [...prevMessages, data['response']['content']])
                if (data["todo"].length > 0) {
                    console.log(data)
                    let todoData = { 'text': data["todo"], 'completed': false, 'label': data["label"] }
                    setTodos((prevTodos) => [...prevTodos, todoData])
                }

            }).catch(error => {
                console.log("chat failed")
                console.log(error)
                setVentMessages((prevMessages) => [...prevMessages, 'My bad, I had an issue. Try again!'])
            })
        }
    };
    const handleVentInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVentInput(event.currentTarget.value);
    }

    const handleTodoInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTodoInput(event.target.value);
    };

    const handleLongTermInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLongTermInput(event.target.value);
    };

    const handleAddTodo = () => {
        if (todoInput.trim() !== '') {
            let index = todos.length
            let data = { 'text': todoInput, 'completed': false, 'label': 'Loading...' }
            setTodos((prevTodos) => [...prevTodos, data]);
            setTodoInput('');
            const headers = { 'Content-Type': 'application/json' }
            let fetchData = {
                'text': todoInput
            }
            let response = fetch("http://localhost:8000/label", {
                method: "POST",
                headers: headers,
                body: JSON.stringify(fetchData)
            }).then(response => {
                return response.json()
            }).then((data) => {
                console.log(data)
                setTodos((prevTodos) => {
                    const updatedTodos = [...prevTodos];
                    updatedTodos[index].label = data['label']
                    return updatedTodos;
                });

            }).catch(error => {
                console.log("label generation failed")
                console.log(error)
            })
        }
    };

    const handleTodoItemClick = (index: number) => {
        console.log("clicked")
        setTodos((prevTodos) => {
            const updatedTodos = [...prevTodos];
            updatedTodos[index].completed = !updatedTodos[index].completed
            return updatedTodos;
        });
    };

    const handleAddLongTermTask = () => {
        if (longTermInput.trim() !== '') {
            setLongTermTasks((prevTasks) => [...prevTasks, longTermInput]);
            setLongTermInput('');
        }
    };

    const getLabelColor = (text) => {
        switch (text.toLowerCase()) {
            case 'home':
                return 'green';
            case 'personal':
                return 'navy';
            case 'work':
                return 'purple';
            case 'Loading...':
                return 'black'
            case 'social':
                return 'hotpink'
            case 'emergency':
                return 'red'
            default:
                return 'black'; // Default background color if the text doesn't match any of the cases
        }
    };
    return (
        <div>
            {/* Header */}
            <motion.header className="header">
                <motion.div className="header-text">Your Logo</motion.div>
                <motion.button className="login-button">Login</motion.button>
            </motion.header>

            {/* Three Columns */}
            <div className="container">
                {/* Left Column */}
                <motion.div className="column">
                    <div>
                        <label className="label">Vent to me, how're you feelin</label>
                        <ul className="todo-list">

                            {ventMessages.map((todo, index) => {
                                if (index % 2 == 0) {
                                    return (
                                        <motion.li
                                            key={index}
                                            className="user-chat"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                        >
                                            <motion.div className="user-text">{todo}</motion.div>
                                        </motion.li>
                                    )
                                } else {
                                    return (
                                        <motion.li
                                            key={index}
                                            className="ai-chat"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                        >
                                            <motion.div className="ai-text">{todo}</motion.div>
                                        </motion.li>
                                    )
                                }
                            })}
                        </ul>
                        <div className="input-container">
                            <motion.input
                                type="text"
                                value={ventInput}
                                onKeyDown={handleVentInputKey}
                                onChange={handleVentInputChange}
                                className="input"
                                placeholder='Press "Enter" to chat! e.g. "add get groceries to my todo list"'
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Middle Column */}
                <motion.div className="column">
                    <div>
                        <label className="label">To-Do List</label>
                        <ul className="todo-list">
                            {todos.map((todo, index) => (
                                <motion.li
                                    key={index}
                                    className="todo-item"
                                    style={{
                                        backgroundColor: todo.completed ? "#F1F1E6" : "#FFECCC",
                                        opacity: todo.completed ? 0.5 : 1
                                    }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <motion.div
                                        className="todo-item-icon"
                                        style={{
                                            opacity: todo.completed ? 0.5 : 1,
                                        }}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        onClick={() => handleTodoItemClick(index)}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        {todo.completed && <span>√</span>}
                                        {/* √ */}
                                    </motion.div>
                                    <motion.div
                                        className="todo-text"
                                        style={{
                                            textDecoration: todo.completed ? "line-through" : "none",
                                            opacity: todo.completed ? 0.5 : 1
                                        }}>
                                        {todo.text}
                                    </motion.div>
                                    <motion.div className="todo-label"
                                        style={{
                                            opacity: todo.completed ? 0.5 : 1,
                                            backgroundColor: getLabelColor(todo.label)
                                        }}>{todo.label}</motion.div>
                                </motion.li>
                            ))}
                        </ul>
                        <div className="input-container">
                            <motion.input
                                type="text"
                                value={todoInput}
                                onChange={handleTodoInputChange}
                                className="input"
                            />
                            <motion.button onClick={handleAddTodo} className="add-button">
                                Add Todo
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column */}
                <motion.div className="column">
                    <div>
                        <label className="label">Long Term Tasks</label>
                        <ul className="todo-list">
                            {longTermTasks.map((todo, index) => (
                                <motion.li
                                    key={index}
                                    className="todo-item"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <motion.div
                                        className="todo-item-icon"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                    />
                                    <motion.div className="todo-text">{todo}</motion.div>
                                </motion.li>
                            ))}
                        </ul>
                        <div className="input-container">
                            <motion.input
                                type="text"
                                value={longTermInput}
                                onChange={handleLongTermInputChange}
                                className="input"
                            />
                            <motion.button onClick={handleAddLongTermTask} className="add-button">
                                Add Task
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
export default App;