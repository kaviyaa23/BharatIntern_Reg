const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

// Ensure the connection string is correct
mongoose.connect(`mongodb+srv://${username}:${encodeURIComponent(password)}@cluster0.mia0a.mongodb.net/myDatabase?retryWrites=true&w=majority`, {
    // Removed deprecated options
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Registering schema
const registrationSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const Registration = mongoose.model('Registration', registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/index.html');
});

console.log("Starting server...");

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await Registration.findOne({ email : email });
        if (!existingUser) {

            const registrationData = new Registration({
                username,
                email,
                password
            });
    
            // Use await to ensure the save operation completes
            await registrationData.save();
            res.redirect('/success');
            //return res.redirect('/error');
        }
        else {
            alert("User already exists");
            res.redirect('/error');
        }

        
    } catch (error) {
        console.log(error);
        res.redirect("/error"); // Corrected path to include a slash
    }
});

app.get('/success', (req, res) => {
    res.sendFile(__dirname + '/pages/success.html');
});

app.get('/error', (req, res) => {
    res.sendFile(__dirname + '/pages/error.html');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
