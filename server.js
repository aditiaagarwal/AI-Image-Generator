const express = require('express');
const OpenAI = require("openai");

const bodyParser= require("body-parser");
const path = require('path');
const { describe } = require('node:test');
const app = express();
const port = 3000;
const dirPath = path.join(__dirname, '/views/index.ejs');

app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs')

const openai = new OpenAI({
  api_key: 'OPENAI_API_KEY'
});

app.use(bodyParser.urlencoded({extended:true}))

var inputData;

app.get('/', (req,res)=>{ 
  res.render("index", {url: '/submit',
  link: ""}); 
}) 

app.post('/submit', async(req, res) => {
  // res.sendFile(__dirname + '/index.ejs');
  
  try {
    inputData = req.body.inputData;
    const apiKey = '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';
    const imageUrl = await generateImage(inputData, apiKey);
    res.render('index.ejs', { link:imageUrl , input:inputData});

  } catch (error) {
    console.error('API Request Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function generateImage(prompt, apiKey) {
  const response = await openai.images.generate({
    prompt: prompt,
    n: 1,
    size: "512x512",
  });
  image_url = response.data[0].url;

  if (response.data.status != 0) {
    console.log(image_url)
    return image_url;

  } else {
    throw new Error('Image Generation Failed');
  }
}

app.use('/', function(req, res){
  res.render(dirPath); 
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});