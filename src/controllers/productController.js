const Product=require('../models/productModel');

const addProduct = async (req, res) => {
    try {
        //getting id of last product to create new id for new product
        var lastId=0;
        const lastProduct=await Product.find().sort({_id:-1}).limit(1);
        if(lastProduct[0]!=null){
            const jsonString=JSON.stringify(lastProduct[0]);
            const jsonObj=JSON.parse(jsonString);
            lastId=parseInt(jsonObj.productId[3]);
        }
        const productId=req.body.productName[0].toLowerCase()+req.body.productName[1].toLowerCase()+"-"+(lastId+1);
    
        const product=await Product.create({
            productId: productId,
            productName: req.body.productName,
            image: req.body.image,
            price: req.body.price,
            category: req.body.category,
            quantity: req.body.quantity
        });

        res.status(200).json({message: "Product successfully added!", product});
    } catch (error) {
        if(error.name==='ValidationError'){
            return res.status(400).json({message: Object.values(error.errors)[0].message});
        }
        else if (error.name==='MongoServerError' && error.code===11000) {
            return res.status(409).json({ message: 'Product already exists.' });
        }

        res.status(500).json({message: "Unable to add product."})
    }
}


const getProductsByCategory = async (req, res) => {
    try {
        const page=parseInt(req.query.page) || 1;
        const limit=parseInt(req.query.limit) || 5;

        const skip=(page-1) * limit;

        let products = [];
        let totalProducts;
        if(req.params.category=='All') {
            products = await Product.find().sort({createdAt: -1}).skip(skip).limit(limit).populate('reviews');
            totalProducts = await Product.countDocuments();
        } 
        else {
            products = await Product.find({ category: req.params.category }).sort({createdAt: -1}).skip(skip).limit(limit).populate('reviews');
            totalProducts = await Product.countDocuments({ category: req.params.category });
        }

        const totalPages = Math.ceil(totalProducts/limit);

        res.status(200).json({page, totalProducts, totalPages, products});
    } catch (error) {
        res.status(500).json({ message: 'Unable to get products.'});
    }
}

const getProduct = async (req, res) => {
    try {
        //finding and checking if country exists
        const product=await Product.findOne({productId: req.params.productId}).populate('reviews');
        if(!product){
            return res.status(404).json({message: "This product does not exist."});
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Unable to get product."});
    }
}

const updateProduct = async (req, res) => {
    try {
        const product=await Product.findOne({productId: req.params.productId});
        if(!product){
            return res.status(404).json({message: "This product does not exist."});
        }

        for (const field in req.body) {
            switch (field) {
                case 'productId':
                    product.productId = req.body.productId;
                    break;
                case 'productName':
                    product.productName = req.body.productName;
                    break;
                case 'price':
                    product.price = req.body.price;
                    break;
                case 'image':
                    product.image = req.body.image;
                    break;
                case 'category':
                    product.category = req.body.category;
                    break;
                case 'quantity':
                    product.quantity = req.body.quantity;
                    break;
            }
        }

        const updatedProduct=await product.save();
        res.status(200).json({message: "Product successfully updated!", updatedProduct});
    } catch (error) {
        if(error.name==='ValidationError'){
            return res.status(400).json({message: Object.values(error.errors)[0].message});
        }
        else if (error.name==='MongoServerError' && error.code===11000) {
            return res.status(409).json({ message: 'Product already exists.' });
        }

        res.status(500).json({ message: "Product could not be updated."});
    }
}

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({productId: req.params.productId});
        
        if(!product) {
            return res.status(404).json({ message: "This product does not exist."});
        }

        res.status(200).json({message: "Product successfully deleted!", product});
    } catch (error) {
        res.status(500).json({ message: "Product could not be deleted."});
    }
}

module.exports={
    addProduct,
    getProductsByCategory,
    getProduct,
    updateProduct,
    deleteProduct
};