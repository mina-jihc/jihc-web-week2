import http from "node:http";
import fs from "node:fs/promises";
import parse from "co-body";

const readDB = async () => {
  try {
    const data = await fs.readFile("./data.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};
const writeDB = async (data) =>
  await fs.writeFile("./data.json", JSON.stringify(data, null, 2));

http
  .createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Content-Type", "application/json");

    if (req.method === "OPTIONS"){
      res.statusCode = 200;
      return res.end();
    } 

    if (req.url === "/users" && req.method === "GET") {
      return res.end(JSON.stringify(await readDB()));
    }

    if (req.url === "/register" && req.method === "POST") {
      const body = await parse.json(req);
      const users = await readDB();

      if (!body.email || !body.password) {
        res.statusCode = 400;
        return res.end(
          JSON.stringify({ error: "Email and password are required!" }),
        );
      }

      const isExist = users.find((u) => u.email === body.email);
      if (isExist) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: "Email already exists!" }));
      }
      users.push(body);
      await writeDB(users);

      res.statusCode = 201;
      return res.end(JSON.stringify({ message: "Welcome!" }));
    }
    if (req.url === "/login" && req.method === "POST") {
      const body = await parse.json(req);
      const users = await readDB();
      const user = users.find(
        (u) => u.email === body.email && u.password === body.password,
      );
      if (user) {
        return res.end(JSON.stringify({ message: "U succesfully entered!" }));
      }
      res.statusCode = 401;
      return res.end(
        JSON.stringify({ message: "Email or password is wrong!" }),
      );
    }
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "not found" }));
  })
  .listen(3000, () => console.log("Server is listening on port 3000"));
