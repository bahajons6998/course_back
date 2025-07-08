const { hashPassword, comparePassword } = require('../utils/password.hash');
const { prisma } = require('../prisma/prisma');
const { generateToken } = require('../utils/token');

// Create User
const register = async (req, res) => {
  const { email, password, name } = req.body;
  console.log(email, password, name)
  console.log(await hashPassword(password))
  try {
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const user = await prisma.user.create({
      data: {
        email,
        password: await hashPassword(password),
        name
      },
    });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Email incorrect' });

    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).json({ error: 'Password incorrect' });

    const token = generateToken(user);

    res.json({ message: 'Loged in successfully', user, token });
  } catch (err) {
    console.log(err)
    res.status(401).json({ error: 'Login error' });
  }
};




const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { Template: true },
    });
    if (!user) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, name, description, avatar, role } = req.body;
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        email,
        password, // Eslatma: Parolni yangilashda hashlash kerak
        name,
        description,
        avatar,
        role,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    const id = req.body;
    // Foydalanuvchilarni o'chirish
    const ids = usersId.map(id => parseInt(id));
    await prisma.user.deleteMany({
      where: {
        id: {
          ids
        }
      },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,



  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};