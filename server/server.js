const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models").User;

const cors = require("cors");

const PORT = process.env.PORT || 3030;
const SALTROUNDS = 10;
const SECRETCODE = "thisismysupersecretcode";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const findUser = await User.findAll({ where: { email: email } });

    if (findUser.length > 0) {
      return res.status(400).json({ errors: [{ msg: "User exists" }] });
    }

    const salt = await bcrypt.genSalt(SALTROUNDS);
    const hashedPassword = await bcrypt.hash(String(password), salt);

    const result = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const payload = {
      user: { name: name },
    };

    jwt.sign(payload, SECRETCODE, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;

      res.status(200).json({ authToken: token });
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ errors: [{ msg: "Email & password must not be empty" }] });

  try {
    const user = await User.findOne({ where: { email: email } });
    const isMatch = await bcrypt.compare(String(password), user.password);

    if (!isMatch || !user)
      return res.status(400).json({ errors: [{ msg: "Invalid credential" }] });

    const payload = {
      user: { name: user.name },
    };

    jwt.sign(payload, SECRETCODE, { expiresIn: 60 }, (err, token) => {
      if (err) throw err;

      res.status(200).json({ authToken: token });
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

app.post("/api/validate", (req, res) => {
  const authToken = req.body.token;

  if (!authToken)
    return res.status(400).json({ errors: [{ msg: "not authorized" }] });

  jwt.verify(authToken, SECRETCODE, function (err, decoded) {
    if (err) {
      return res.status(400).json({ errors: [{ msg: "Invalid credential" }] });
    }

    console.log(decoded);
    return res.status(200).json({ success: true, data: decoded });
  });
});

app.get("/", (req, res) => {
  res.json({ message: "hello" });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
