const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Customize these with your details
const FULL_NAME = "john_doe";       // lowercase, as per rule
const EMAIL = "john@xyz.com";
const ROLL_NUMBER = "ABCD123";
const DOB = "17091999"; // ddmmyyyy format

function processData(dataArr) {
    const even_numbers = [];
    const odd_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0;
    let alphaString = [];

    // Helper functions
    function isNumber(val) {
        return /^[0-9]+$/.test(val);
    }
    function isAlphabet(val) {
        return /^[A-Za-z]+$/.test(val);
    }
    function isSpecialChar(val) {
        return !isNumber(val) && !isAlphabet(val);
    }

    dataArr.forEach(item => {
        const strItem = String(item);
        if (isNumber(strItem)) {
            // Number logic
            let n = parseInt(strItem, 10);
            if (n % 2 === 0) {
                even_numbers.push(strItem);
            } else {
                odd_numbers.push(strItem);
            }
            sum += n;
        } else if (isAlphabet(strItem)) {
            // Alphabet logic
            alphabets.push(strItem.toUpperCase());
            alphaString.push(strItem);
        } else if (isSpecialChar(strItem)) {
            special_characters.push(strItem);
        }
    });

    // Concatenation logic: reverse all alpha chars, alternating caps
    let concat_string = "";
    alphaString = alphaString.join('').split('').reverse();
    concat_string = alphaString.map((char, idx) => {
        return idx % 2 === 0 ? char.toUpperCase() : char.toLowerCase();
    }).join('');

    return {
        is_success: true,
        user_id: `${FULL_NAME}_${DOB}`,
        email: EMAIL,
        roll_number: ROLL_NUMBER,
        odd_numbers,
        even_numbers,
        alphabets,
        special_characters,
        sum: sum.toString(),
        concat_string
    };
}

// POST /bfhl route
app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;
        if(!Array.isArray(data)) {
            return res.status(400).json({ is_success: false, message: "Invalid input" });
        }
        const response = processData(data);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ is_success: false, message: "Server Error" });
    }
});

// Health check
app.get('/', (req, res) => res.send('BFHL API is running'));

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
