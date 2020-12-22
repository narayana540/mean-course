const http=require('http');

const app=require('../backend/app')

const port= process.env.PORT || 3000;


app.set('port',port);

const server=http.createServer(app);
//   (port)=>{
//   // console.log('this is the first node js pgm')
//   //  res.end("this is my 3ndadad first response");
//  })

 server.listen(port);
