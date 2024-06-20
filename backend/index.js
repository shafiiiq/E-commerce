const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors")


app.use(express.json());
app.use(cors());

// 0k3KHTmoR5WhL7SF

// Database connection with mongodb 
mongoose.connect('mongodb+srv://shafiiq688:0k3KHTmoR5WhL7SF@cluster0.twt9xff.mongodb.net/e-commerce')

// API creation
app.get('/', (req, res) => {
    res.send("Express app is running")
})

// Image storage engine 
const storage = multer.diskStorage({
    destination: './uploads/images',
    filename: (req, file, cb) => { // file parameter added here
        // Generate a unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const fileExtension = path.extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;
        cb(null, filename);
    }
});


const upload = multer({
    storage: storage
})

// Creating endpoint for posting the images
app.use('/images', express.static('uploads/images'))
app.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for creating products 
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    quality: {
        type: String,
        require: true
    },
    color: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    weight: {
        type: Number,
        require: true
    },
    size: {
        type: Number,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    available: {
        type: Boolean,
        default: true
    }
})

// End point for adding products 
app.post('/add-products', async (req, res) => {
    let products = await Product.find({});
    let id;

    if (products.length > 0) {
        let last_product = products[products.length - 1];
        id = last_product.id + 1;
    } else {
        id = 1;
    }

    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        price: req.body.price,
        weight: req.body.weight,
        color: req.body.color,
        weight: req.body.weight,
        description: req.body.description,
        quality: req.body.quality,
        brand: req.body.brand,
    });

    console.log(product);
    await product.save();
    console.log("Successfully added the product");

    res.json({
        success: 1,
        name: req.body.name
    });
});


// Endpoint for removing the products 
app.post('/delete-products', async (req, res) => {
    await Product.findOneAndDelete({
        id: req.body.id
    })
    console.log("Removed the product");

    res.json({
        success: true,
        name: req.body.name
    })
})

// End point for fetching all products 
app.get('/get-products', async (req, res) => {
    let products = await Product.find({})
    console.log("All products fetched");
    console.log(products);
    res.send(products);
})

// Data base schema for userr 
const Users = mongoose.model("Users", {
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    cart: {
        type: Array,
        default: []
    }
})

// End point for user signup 
app.post('/signup', async (req, res) => {
    let already = await Users.findOne({
        email: req.body.email
    })

    if (already) {
        return res.status(400).json({
            success: false,
            error: "Email is already exists"
        })
    }

    let cart = {}

    for (let i = 0; i <= 500; i++) {
        cart[i] = 0
    }

    const user = new Users({
        email: req.body.email,
        password: req.body.password,
        cart: cart
    })

    await user.save();

    const data = {
        user: {
            id: user.id
        }
    }

    const token = jwt.sign(data, 'secret_ecom');
    res.json({
        success: true,
        token: token
    })
})

// End point for user login 
app.post('/login', async (req, res) => {
    let user = await Users.findOne({
        email: req.body.email
    })

    if (user) {
        const comparePswd = req.body.password === user.password;

        if (comparePswd) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom')
            res.json({
                success: true,
                token: token
            })
        } else {
            res.json({
                success: false,
                error: "Password is incorrect"
            })
        }
    } else {
        res.json({
            success: false,
            error: "User is not found"
        })
    }
})

//Creating a middleware to authenticate user
const authUser = (req, res, next) => {
    const token = req.header('auth-token');
    console.log(token);
    if (!token) {
        return res.status(401).send({ errors: "Please authenticate using a valid token" });
    }

    try {
        const data = jwt.verify(token, 'secret_ecom');
        console.log(data.user);
        req.user = data.user;
        next();
    } catch (err) {
        res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
}

// End point to add products to cart 
app.post('/addtocart', authUser, async (req, res) => {
    console.log("Received request with itemId:", req.body);
    console.log(req.user);

    // Retrieve the user data
    let userData = await Users.findOne({
        _id: req.user.id
    });
    
    // Ensure the nested cart array exists
    if (!userData.cart[0]) {
        userData.cart[0] = [];
    }

    // Initialize the item count if it doesn't exist
    if (!userData.cart[0][req.body.itemId]) {
        userData.cart[0][req.body.itemId] = 0;
    }

    // Increment the item count
    userData.cart[0][req.body.itemId] += 1;

    // Update the user's cart data
    await Users.findOneAndUpdate(
        { _id: req.user.id },
        { cart: userData.cart }
    );

    // Send a JSON response
    res.json({ message: "Product added" });
});

// Endpoint to remove products from cart
app.post('/removefromcart', authUser, async (req, res) => {
    console.log("Received request to remove itemId:", req.body.itemId);
    console.log(req.user);

    try {
        // Retrieve the user data
        let userData = await Users.findOne({
            _id: req.user.id
        });

        // Ensure the nested cart array exists
        // if (!userData.cart[0]) {
        //     userData.cart[0] = [];
        // }

        // Check if the item exists in the cart
        if (userData.cart[0][req.body.itemId]) {

            userData.cart[0][req.body.itemId] = 0;
            // if (userData.cart[0][req.body.itemId] <= 0) {
            //     delete userData.cart[0][req.body.itemId];
            // }
        } else {
            throw new Error("Item not found in cart");
        }

        // Update the user's cart data
        await Users.findOneAndUpdate(
            { _id: req.user.id },
            { cart: userData.cart }
        );

        // Send a JSON response
        res.json({ message: "Product removed from cart" });
    } catch (error) {
        console.error("Error removing product from cart:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// End point to get user cart 
app.get('/getcart', authUser, async (req, res) => {
    try {
        // Retrieve user's cart from database
        let userData = await Users.findOne({
            _id: req.user.id
        });

        let productsInCart = [];

        for (let itemId in userData.cart[0]) {
            if (userData.cart[0][itemId] > 0) {
                let product = await Product.findOne({ id: itemId });

                if (product) {
                    // Create a new object with product details and quantity
                    let productInfo = {
                        id: product.id,
                        name: product.name,
                        image: product.image,
                        description: product.description,
                        category: product.category,
                        quality: product.quality,
                        color: product.color,
                        price: product.price,
                        weight: product.weight,
                        size: product.size,
                        count: userData.cart[0][itemId] 
                    };

                    productsInCart.push(productInfo);
                }
            }
        }

        res.json(productsInCart);
    } catch (error) {
        console.error("Error fetching user's cart:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to fetch a product by id
app.get('/product/:id', async (req, res) => {
    const productId = req.params.id;
    console.log(productId);

    try {
        let product = await Product.findOne({ id: productId });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(port, (err) => {
    if (!err) {
        console.log("Server running on " + port);
    } else {
        console.log("error: " + err);
    }
})
