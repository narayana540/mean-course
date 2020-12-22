
const express = require('express');
const multer=require('multer');
const router = express.Router();
const Post=require('../models/post');

const MIME_TYPE_MAP = {
  'image/png':'png',
  'image/jpeg':'jpg',
  'image/jpg':'jpg'
};

const storage = multer.diskStorage({
  destination: (res,file,cb) => {
    const isValid=MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error,"backend/images");
  },
  filename: (req,file,cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null,name + '-' + Date.now() + '.' + ext);
  }
});

router.post("",multer({storage:storage}).single("image"),(req,res,next)=>{
  const url = req.protocol + "://" + req.get("host");
  const post=new Post({
    title:req.body.title,
    content:req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  post.save().then(createdPost=>{
    res.status(201).json({
      message:'Post added successfully',
      post: {
        ...createdPost,
        id:createdPost._id,
      }
    })
    //  postId=createdPost._id;
  });

})
router.put("/:id",multer({storage:storage}).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id:req.body.id,
    title:req.body.title,
    content:req.body.content,
    imagePath: imagePath
  });
  console.log(post);
  Post.updateOne({_id:req.params.id},post).then(result => {
    console.log(result);
    res.status(200).json({message:'Update successful!'})
  })
});



router.get('',(req, res, next)=>{
//   const posts=[
//     {id:1,title:'this is first title',content:'this is coming from the server'},
//     {id:2,title:'this is second title',content:'this is coming from the server'}
// ];

Post.find().then(documents=>{
  res.status(200).json({
    message:'posts fetched successfully',
    posts:documents,
  });
});
});
router.get("/:id",(req,res,next) => {
  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    }
    else {
      res.status(404).json({message:"Post not found!"});
    }
  })

})


router.delete('/:id',(req,res,next)=>{
  Post.deleteOne({_id:req.params.id}).then(result=>{
    console.log(result);
    res.status(200).json({message:'Post Deleted'})
  })

})

router.use((req,res)=>{
  res.send('hello this is from express');
});

module.exports = router;

