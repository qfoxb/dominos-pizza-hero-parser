const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');

// Use Charles Proxy key and crt
const privateKeyPath = path.join(__dirname, 'private.key');
const certificatePath = path.join(__dirname, 'certificate.crt');

const options = {
    key: fs.readFileSync(privateKeyPath),
    cert: fs.readFileSync(certificatePath),
};

function parseToppings(toppingsString) {
    const toppings = {
        X: 'Base/Crust',
        C: 'Cheese',
        P: 'Pepperoni',
        S: 'Sausage',
        H: 'Ham',
        M: 'Mushrooms',
        G: 'Green Peppers',
        Rr: 'Red Peppers',
        O: 'Onions',
        N: 'Pineapple',
        Si: 'Spinach',
        Fe: 'Feta Cheese',
    };

    const decodedToppingsString = decodeURIComponent(toppingsString);
    console.log(`Decoded Toppings String: ${decodedToppingsString}`); // Debugging line

    return decodedToppingsString.split('|').map(topping => {
        const [code] = topping.split(':');
        console.log(`Parsed Topping Code: ${code}`);
        return toppings[code] || 'Unknown Topping';
    });
}

const server = https.createServer(options, (req, res) => {
    const parsedUrl = url.parse(req.url);
    const query = querystring.parse(parsedUrl.query);

    const variantCode = query['variantCode_0'];
    const toppings = query['toppings_0'];
    const orderVariantID = query['orderVariantID'];

    const parsedToppings = parseToppings(toppings);

    const fullUrl = `https://${req.headers.host}${req.url}`;

    console.log(`Full URL: ${fullUrl}`);
    console.log(`Variant Code: ${variantCode}`);
    console.log(`Parsed Toppings: ${parsedToppings.join(', ')}`);
    console.log(`Order Variant ID: ${orderVariantID}`);

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(`Pizza order received:\nFull URL: ${fullUrl}\nVariant Code: ${variantCode}\nToppings: ${parsedToppings.join(', ')}\nOrder Variant ID: ${orderVariantID}\n`);
});

server.listen(443, () => {
    console.log('Server running on port 443');
});
