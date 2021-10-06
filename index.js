import mongoose from 'mongoose';

// Define schemas and create models
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: String,
    email: String,
    posts: [{ type: Schema.Types.ObjectId, ref: 'test-posts' }] 
});

const postSchema = new Schema({
    content: String,
    title: String,
    user: { type: Schema.Types.ObjectId, ref: 'test-users' }
});

const User = mongoose.model('test-users', userSchema);
const Post = mongoose.model('test-posts', postSchema);

// ----------------------------------------------------------------------------
// Connect to MongoDB
const connectionString = `mongodb://jimmy:passw0rd@localhost:27017/exampledb`;
await mongoose.connect(connectionString);

// ----------------------------------------------------------------------------
// Clear old data; reset everything
await User.deleteMany({});
await Post.deleteMany({});

// ----------------------------------------------------------------------------
// Create new shiny data
const user = await User.create({ name: "Joel", email: "joel@example.org" });

const post = await Post.create({
    content: "Lettuce, Spinach, Potatoes and Tomatoes",
    title: "Best salad",
    user: user._id
});

user.posts.push(post);
await user.save();

// ----------------------------------------------------------------------------
// Let's query the data
// Load the Post and also it's associated user
// console.log(await Post.findOne({}).populate("user"));

// Load the User and also it's associated posts
// console.log(await User.findOne({}).populate("posts", ["title"]));

// Advanced query
const query = User.findOne({});
query.select("-email"); // Select which fields to get from the users data; here we get all data EXCEPT the email one!
query.populate("posts", ["content"]);

console.log(await query.exec());

// ----------------------------------------------------------------------------
// Let's Disco(nnect)!
await mongoose.disconnect();