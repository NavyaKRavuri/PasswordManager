const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = mongoose.model("user");
const jwt = require("jsonwebtoken");

// Register
exports.register = async (req, res) => {
    try {
        const { username, password, confirm_password } = req.body;

        var errors = {}; 

        // Validate user input
        if (!username) {
            Object.assign(errors, { user_name: "username field is required" });
        }

        if (!password) {
            Object.assign(errors, { password: "password field is required" });
        }else if(password.length < 8) {
            Object.assign(errors, { password: "password must be atleast 8 characters long"});
        }else if (password !== confirm_password) {
            Object.assign(errors, {password: "password and confirm password must be equal"});
        }else if(!confirm_password) {
            Object.assign(errors, {
                confirm_password: "confirm password field is required",
            });
        }
       

        // check if user already exist
        // Validate if user exist in our database
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            // res.status(409).json({error: "User Already Exist. Please Login"});
            Object.assign(errors, {
                user_name: "User Already Exist. Please Login",
            });
        }

        if (Object.keys(errors).length !== 0) {
            return res.status(422).json(errors);
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            username: username.toLowerCase(),
            password: encryptedPassword,
        });

        // Create token
        // Create token
        const token = jwt.sign(
            { user_id: user._id, username },
            process.env.TOKEN_KEY,
            {
            expiresIn: "2h",
            }
        );

        // save user token
        user.token = token;

        res.status(200).json(user);
    } catch (err) {
        return res.status(424).json(err);
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        var errors = {};

        // Validate user input
        if (!username) {
            Object.assign(errors, { user_name: "username field is required" });
        }
        if (!password) {
            Object.assign(errors, { password: "password field is required" });
        }

        if (Object.keys(errors).length !== 0) {
            return res.status(422).json(errors);
        }

        // Validate if user exist in our database
        const user = await User.findOne({ username });
            
        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, username },
                process.env.TOKEN_KEY,
                {
                expiresIn: "2h",
                }
            );
    
            // save user token
            user.token = token;

            res.status(200).json(user);
        } else {
            return res.status(400).json({combined_error: "Invalid Credentials(username or password is incorrect)"});
        }
    } catch (err) {
        return res.status(424).json(err);
    }
};
