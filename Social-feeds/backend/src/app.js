const express=require('express')
const multer=require('multer')
const uploadFile=require('./services/storage.service')
const postModel=require('./models/post.model')
const cors=require("cors")


const app= express()

// middleware
app.use(cors())
app.use(express.json())


const upload =multer({storage:multer.memoryStorage()})

app.post("/create-post", upload.single("image"), async (req, res) => {
  try {
    console.log(req.body)
    console.log(req.file)

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    const result = await uploadFile(req.file.buffer)

    const post = await postModel.create({
      image: result.url,
      caption: req.body.caption
    })

    console.log(result)

    return res.status(201).json({
      message: "Post created successfully",
      post
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
})

app.get("/posts",async(req, res)=>{
    
try{
  const posts=await postModel.find()

   return res.status(200).json({
        message:"post fetches successfully..",
        posts
    })
}catch(err){
  console.error(err)
  return res.status(500).json({
    error:err.message
  })
}
})

app.delete("/post/:id", async (req, res) => {
  const id = req.params.id;
  await postModel.findOneAndDelete({
    _id: id,
  });

  res.status(200).json({
    message: "post Deleted Successfully..",
  });
});

// app.delete("/delete-post",async(req, res)=>{
    

//     res.status(200).json({
//         message:"post deleted successfully.."
//     })
// })


module.exports=app