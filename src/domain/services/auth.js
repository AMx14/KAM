const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { models } = require('../../infra/db');



const AuthService = {
    async register(req, res) {
        try {
            const {username, password, role} = req.body;

            if (!username || !password || !role) {
                return res.status(400).json({error: 'All fields are required'});
            }

            // Check if the username already exists
            const existingUser = await models.User.findOne({where: {username}});
            if (existingUser) {
                return res.status(400).json({error: 'Username already exists. Please choose another.'});
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create the user
            const user = await models.User.create({username, password: hashedPassword, role});

            res.status(201).json({
                message: 'User registered successfully',
                user: {id: user.id, username: user.username, role: user.role},
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({error: 'Failed to register user'});
        }
    },

    async login(req, res) {
        const { username, password } = req.body;
        try {
            const user = await models.User.findOne({ where: { username } });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({ message: 'Login successful', token });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async profile(req, res) {
        try {
            // Fetch user details from the database using the ID from the token
            const user = await models.User.findByPk(req.user.id, {
                attributes: ['id', 'username', 'role'], // Include username in response
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found.' });
            }

            res.status(200).json({ user });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to fetch profile. Please try again later.' });
        }
    }
    ,
};

module.exports = AuthService;
