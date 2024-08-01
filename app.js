const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const app = express();

//Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/image'); //Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage});

// Create MySQL connection
const connection = mysql.createConnection({
host: 'mysql-jem.alwaysdata.net',
user: 'jem',
password: 'JefYam1226',
database: 'jem_musicstore'
});


connection.connect((err) => {
if (err) {
console.error('Error connecting to MySQL:', err);
return;
}
console.log('Connected to MySQL database');
});


// Set up view engine
app.set('view engine', 'ejs');

// enable static files
app.use(express.static('public'));

app.use(express.urlencoded({
    extended: false
}));

// Define routes

app.get('/', (req,res) => {
const sql = 'SELECT "brands" FROM products';
    connection.query( sql, (error,results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving products');
        }
        res.render('home',{ products: results });
    });
});


app.get('/guitars', (req,res) => {
    const sql = 'SELECT * FROM products WHERE category = "guitar" '
    connection.query( sql, (error,results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving products');
        }
        res.render('guitar',{ products: results });
    });
});

app.get('/keys', (req,res) => {
    const sql = 'SELECT * FROM products WHERE category = "keys" '
    connection.query( sql, (error,results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving products');
        }
        res.render('keys',{ products: results });
    });
});

app.get('/strings', (req,res) => {
    const sql = 'SELECT * FROM products WHERE category = "strings" '
    connection.query( sql, (error,results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving products');
        }
        res.render('strings',{ products: results });
    });
});

app.get('/drums', (req,res) => {
    const sql = 'SELECT * FROM products WHERE category = "drums" '
    connection.query( sql, (error,results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving products');
        }
        res.render('drums',{ products: results });
    });
});

app.get('/percussion', (req,res) => {
    const sql = 'SELECT * FROM products WHERE category = "percussion" '
    connection.query( sql, (error,results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving products');
        }
        res.render('percussion',{ products: results });
    });
});

app.get('/microphones', (req,res) => {
    const sql = 'SELECT * FROM products WHERE category = "microphones" '
    connection.query( sql, (error,results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving products');
        }
        res.render('microphones',{ products: results });
    });
})

app.get('/pedals', (req,res) => {
    const sql = 'SELECT * FROM products WHERE category = "pedals" '
    connection.query( sql, (error,results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving products');
        }
        res.render('pedals',{ products: results });
    });
})

app.get('/product/:id', (req, res) => {
    const productID = req.params.id;
    const sql = 'SELECT * FROM products WHERE productID = ?';
    connection.query( sql, [productID], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving product by ID');
        }
        if (results.length > 0) {
            res.render('product', { product: results[0] });
        } else {
            res.status(404).send('Product Unavailable')
        }
    });
});

app.get('/admin', (req,res) => {
    const sql = 'SELECT * FROM products '
    connection.query( sql, (error,results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving products');
        }
        res.render('admin',{ products: results });
    });
});

app.get('/addProduct', (req,res) => {
    res.render('addProduct')
});

app.post('/newProduct', upload.single('image'), (req,res) => {
    const {name, brand, price, details, category} = req.body;
    let image;
    if (req.file) {
        image = req.file.filename;
    }  else {
        image = null;
    }
    
    const sql = 'INSERT INTO products (name, brand, price, details, category, image) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query (sql, [name, brand, price, details, category, image], (error, results) => {
        if (error) {
            console.error("Error adding product:", error);
            res.status(500).send("Error adding product");
        } else {
            res.redirect('/admin');
        }
    });
});


app.get('/deleteProduct', (req,res) => {
    const sql = 'SELECT * FROM products '
    connection.query( sql, (error,results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving products');
        }
        res.render('deleteProduct',{ products: results });
    });
});

app.get('/deleteProduct/:id', (req,res) => {
    const productID = req.params.id;
    const sql = 'DELETE FROM products WHERE productID = ?';
    connection.query( sql, [productID], (error, results) => {
        if (error) {
            console.error("Error deleting product:", error);
            res.status(500).send('Error deleting product');
        } else {
            res.redirect('/admin');
        }
    });
});


app.get('/createProfile', (req,res) => {
    res.render('createProfile');
});

app.post('/newProfile', upload.single('image'), (req,res) => {
    const {name, email, contact} = req.body;
    let image;
    if (req.file) {
        image = req.file.filename;
    }  else {
        image = null;
    }
    
    const sql = 'INSERT INTO customer (name, email, contact, image) VALUES (?, ?, ?, ?)';
    connection.query (sql, [name, email, contact, image], (error, results) => {
        if (error) {
            console.error("Error creating profile:", error);
            res.status(500).send("Error creating profile");
        } else {
            res.redirect('/profile');
        }
    });
});

app.get('/profile', (req,res) => {
    const sql = 'SELECT * FROM customer  '
    connection.query (sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving customer');
        } else {
            res.render('profile', {customer : results});
        }
    });
});


app.get('/editProduct/:id', (req,res) => {
    const productID = req.params.id;
    const sql = 'SELECT * FROM products WHERE productID = ?';
    connection.query ( sql, [productID], (error,results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving product by ID');
        }
        if (results.length > 0) {
            res.render('editProduct', { product: results[0] });
        } else {
            res.status(404).send('Product not found');
        }
    });
});

app.post('/editProduct/:id', upload.single('image'), (req,res) => {
    const productID = req.params.id;
    const {name, brand, price, details, category } = req.body;
    let image = req.body.currentImage; 
    if (req.file) { 
        image = req.file.filename; 
    }
    const sql = 'UPDATE products SET name = ?, brand = ?, price = ?, details = ?, category = ?, image = ? WHERE productID = ?';

    connection.query( sql, [name, brand, price, details, category, image, productID], (error, results) => {
        if (error) {
            console.error("Error updating product:", error);
            res.status(500).send('Error updating product');
        } else {
            res.redirect('/admin');
        }
    });
});

app.get('/deleteProfile/:id', (req,res) => {
    const customerID = req.params.id;
    const sql = 'DELETE FROM customer WHERE customerID = ?';
    connection.query( sql, [customerID], (error, results) => {
        if (error) {
            console.error("Error deleting customer:", error);
            res.status(500).send('Error deleting customer');
        } else {
            res.redirect('/profile');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));