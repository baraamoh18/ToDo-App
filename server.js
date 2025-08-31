const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Example: Add signup route
server.post("/signup", (req, res) => {
  const users = router.db.get("users");
  const { username, password } = req.body;

  // check if user exists
  const existingUser = users.find({ username }).value();
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  users.push({ username, password }).write();
  res.status(201).json({ message: "Signup successful" });
});

// Example: Login route
server.post("/login", (req, res) => {
  const users = router.db.get("users");
  const { username, password } = req.body;

  const user = users.find({ username, password }).value();
  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  res.json({ message: "Login successful", user });
});

server.use(router);
server.listen(3000, () => {
  console.log("JSON Server is running");
});
