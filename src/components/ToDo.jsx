import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ToDo() {
  const [todos, setTodos] = useState([]);
  const inputRef = useRef();
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("loggedInUser");

    try {
      const parsedUser = JSON.parse(userData);
      if (!parsedUser) {
        navigate("/login");
      } else {
        setUser(parsedUser);
        setTodos(parsedUser.todos || []);
      }
    } catch {
      navigate("/login");
    } finally {
      setIsChecking(false);
    }
  }, [navigate]);

   if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking user...</p>
      </div>
    );
  }

  if (!user && !isChecking) {
    return null;
  }

  const saveTodosToUser = (updatedTodos) => {
    setTodos(updatedTodos);

    const updatedUser = { ...user, todos: updatedTodos };
    setUser(updatedUser);
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.username === user.username ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const handleAdd = () => {
    if (!inputRef.current.value.trim()) {
      inputRef.current.placeholder = "Please type something...";
      inputRef.current.focus();
      return;
    }

    const newTodo = {
      id: Date.now(),
      value: inputRef.current.value,
      completed: false,
    };

    const updatedTodos = [...todos, newTodo];
    saveTodosToUser(updatedTodos);

    inputRef.current.value = "";
    inputRef.current.placeholder = "Add a new task...";
  };

  const activateEdit = (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    inputRef.current.value = todo.value;
    setEditingId(id);
    inputRef.current.focus();
  };

  const handleDone = (id) => {
    const updatedTodos = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    saveTodosToUser(updatedTodos);
  };

  const handleDelete = (id) => {
    const updatedTodos = todos.filter((t) => t.id !== id);
    saveTodosToUser(updatedTodos);
  };

  const handleUpdate = () => {
    if (editingId === null || !inputRef.current.value.trim()) return;

    const newValue = inputRef.current.value.trim();
    const updatedTodos = todos.map((t) =>
      t.id === editingId ? { ...t, value: newValue } : t
    );
    saveTodosToUser(updatedTodos);

    setEditingId(null);
    inputRef.current.value = "";
  };

  const onEnter = (e) => {
    if (e.key === "Enter") {
      editingId === null ? handleAdd() : handleUpdate();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const activeTodosCount = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">ToDo List</h1>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-3">Hello, {user.username}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="flex mb-6">
            <input
              ref={inputRef}
              type="text"
              onKeyDown={onEnter}
              placeholder={editingId ? "Edit your task..." : "Add a new task..."}
              className="flex-grow px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              disabled={loading}
            />
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              disabled={loading}
              className={`px-4 py-3 font-semibold text-white rounded-r-lg ${
                editingId 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-cyan-500 hover:bg-cyan-600'
              } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? '⏳' : editingId ? 'Update' : 'Add'}
            </button>
          </div>

          <div className="flex justify-between mb-6 bg-gray-100 p-2 rounded-lg">
            {["all", "active", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                disabled={loading}
                className={`px-3 py-1 rounded-md capitalize ${
                  filter === f 
                    ? 'bg-cyan-500 text-white' 
                    : 'text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="mb-6 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
                <p className="mt-2 text-gray-600">Loading todos...</p>
              </div>
            ) : filteredTodos.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                {filter === "all" 
                  ? "No tasks yet. Add a new task above!" 
                  : filter === "active" 
                    ? "No active tasks!" 
                    : "No completed tasks!"}
              </div>
            ) : (
              <ul>
                {filteredTodos.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between p-3 border-b border-gray-200"
                  >
                    <div className="flex items-center flex-grow">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleDone(item.id)}
                        className="h-5 w-5 text-cyan-600 rounded focus:ring-cyan-500"
                        disabled={loading}
                      />
                      <span
                        className={`ml-3 flex-grow cursor-pointer ${
                          item.completed ? 'line-through text-gray-400' : 'text-gray-700'
                        }`}
                        onClick={() => handleDone(item.id)}
                      >
                        {item.value}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => activateEdit(item.id)}
                        className="p-1 text-blue-500 hover:text-blue-700 disabled:opacity-50"
                        disabled={loading}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50"
                        disabled={loading}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
            </span>
            <button
              onClick={() => {
              const updatedTodos = todos.filter(todo => !todo.completed); 
              saveTodosToUser(updatedTodos); // update in one go
            }}
            disabled={loading || todos.filter(todo => todo.completed).length === 0}

              className="px-4 py-2 text-sm text-red-500 hover:text-red-700 font-medium disabled:opacity-50 transition-colors"
            >
              Clear completed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToDo;