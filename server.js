import app from './app.js'

app.listen(process.env.PORT,(req,res)=>{
    console.log(`Server running on port ${process.env.PORT} `);
    // console.log(`Connected to mongodb ${process.env.MONGO_URI} `);
});