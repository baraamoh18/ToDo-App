const API_BASE_URL = 'http://localhost:3000';

// Get user's Todos
export const getUserTodos = async (userId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const user = await res.json();
    return user.todos || [];
  } catch (error) {
    console.log("Error fetching user Todos: ", error);
    throw error;
  }
};

// Add a todo for user 
export const addUserTodo = async (userId, newTodo) => {
  try {
    const user = await getUserById(userId);
    const updatedTodos = [...(user.todos || []), newTodo];

    const updatedUser = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...user, todos: updatedTodos }),
    });

    if (!updatedUser.ok) throw new Error(`HTTP error! status: ${updatedUser.status}`);
    return (await updatedUser.json()).todos;
  } catch (error) {
    console.log("Error adding todo: ", error);
    throw error;
  }
};
// toogle todo completion 
export const todoCompletion = async (userId, todoId, completed) => {
  try {
    return await updateUserTodo(userId, todoId, { completed });
  } catch (error) {
    console.error("Error toggling completion:", error);
    throw error;
  }
};


// delete todo
export const deleteUserTodo = async (userId, todoId) => {
  try {
    const user = await getUserById(userId);
    const updatedTodos = user.todos.filter(todo => todo.id !== todoId);

    const updatedUser = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...user, todos: updatedTodos }),
    });

    if (!updatedUser.ok) throw new Error(`HTTP error! status: ${updatedUser.status}`);
    return (await updatedUser.json()).todos;
  } catch (error) {
    console.log("Error deleting todo:", error);
    throw error;
  }
};
// filter tasks by completion
export const filterByCompletion = async (userId, completed = true) => {
  try {
    const user = await getUserById(userId);
    return user.todos.filter(todo => todo.completed === completed);
  } catch (error) {
    console.log("Error filtering todos:", error);
    throw error;
  }
};

// Get all users
export const getUsers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const users = await response.json();
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

// Get user by ID
export const getUserById = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const user = await response.json();
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

// Create new user
export const createUser = async ({ username, email, password }) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                email,
                password,
                todos: []
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};


// Login function
export const loginUser = async (usernameOrEmail, password) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const users = await getUsers();
        const user = users.find(u => 
            (u.username === usernameOrEmail || u.email === usernameOrEmail) && 
            u.password === password
        );
        
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("userId", user.id);
            return user;
        }

        return null;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

// Update user
export const updateUserTodo = async (userId, todoId, updatedTodo) => {
  try {
    const user = await getUserById(userId);
    const updatedTodos = user.todos.map(todo =>
      todo.id === todoId ? { ...todo, ...updatedTodo } : todo
    );

    const updateRes = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...user, todos: updatedTodos }),
    });

    if (!updateRes.ok) throw new Error(`HTTP error! status: ${updateRes.status}`);
    return await updateRes.json();
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
};



// Delete user
export const deleteUser = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};