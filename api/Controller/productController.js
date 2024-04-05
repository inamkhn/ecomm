// import  asyncHandler  from "../middleware/asyncHandler"
import Product from "../models/productModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/user.js";
import getDataUri from "../utils/dataUri.js";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import AWS from "aws-sdk";


const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});


async function uploadFileToS3(file, fileName) {

  const fileBuffer = file;
  console.log(fileName);

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${fileName}`,
    Body: fileBuffer,
    ContentType: "image/jpg"
  }

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return fileName;
}








export const getAllProducts = async (req, res, next) => {
  // const pageSize = 2
  // const page = Number(req.query.page || 1)
  // const count = await Product.countDocuments()

  const price = req.query.price || null;
  const sort = req.query.sort || "asc";
  const category = req.query.category || null;
  const page = Number(req.query.page) || 1;
  const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
  const skip = (page - 1) * limit;
  const keyword = req.query.keyword || "";

  const baseQuery = {};
  if (keyword)
    baseQuery.name = {
      $regex: keyword,
      $options: "i",
    };

  if (price)
    baseQuery.price = {
      $lte: Number(price),
    };

  if (category) baseQuery.category = category;

  try {
    const Products = await Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);
    if (!Products) {
      return next(new ErrorHandler("Products not found", 400));
    }
    res.status(200).json(Products); //page,pages:Math.ceil(count/pageSize)
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (req, res, next) => {
  const product = await Product.distinct("category");
  if (product) {
    res.json(product);
  } else {
    return next(new ErrorHandler("Please enter all field", 400));
  }
};

export const getTopProduct = async (req, res, next) => {
  const product = await Product.find({}).sort({ rating: -1 }).limit(3);
  if (product) {
    res.json(product);
  } else {
    return next(new ErrorHandler("Please enter all field", 400));
  }
};

export const getProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    return next(new ErrorHandler("Please enter all field", 400));
  }
};

export const createProduct = async (req, res) => {
  const {
    name,
    price,
    description,
    brand,
    category,
    numReviews,
    countInStock,
    userId,
  } = req.body;
  const file = req.file;
  const fileUri = getDataUri(file);

  // const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = await uploadFileToS3(file, fileUri.name);

  const product = new Product({
    name: name,
    price: price,
    user: userId,
    image: fileName,
    brand: brand,
    category: category,
    countInStock: countInStock,
    numReviews: numReviews,
    description: description,
  });

  console.log(product);
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

export const updateProduct = async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
};

export const createProductReview = async (req, res) => {
  const { rating, comment, userId } = req.body;
  console.log({ rating, comment, userId });
  const product = await Product.findById(req.params.id);
  const user = await User.findById(userId);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: user.name,
      rating: Number(rating),
      comment,
      user: user,
    };
    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
};
