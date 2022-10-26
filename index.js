
class URLEntity {
    constructor(original, shortened){
        this.original = original;
        this.shortened = shortened;
    }
}
const express = require('express')
const path = require('path')
var validUrl = require('valid-url')

const app = express()

app.use(express.static(path.join(__dirname,"public")))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.set('view engine', 'ejs')

var urlList = [];
 
app.get('/', async (req,res,next) => {
     res.render('index')
})

app.post('/',  async (req, res, next) => {
  
  if( validUrl.isUri(req.body.url)){
            if(await isExistUrl(req.body.url) === 0){
                var shortUrl = await makeShortenerUrl();
                urlList.push(new URLEntity(req.body.url,shortUrl));
                res.send("http://localhost:3000/"+shortUrl)
            }else
            {
                res.status(409).send("Url " +req.body.url + " already exists")
            }
  }else{
    res.status(422).send("Url " +req.body.url + " is not valid!")
  }
  
})

app.get("/:shortenedUrl", async (req, res, next) => {
     res.redirect(await getOriginalUrlByShortUrl(req.params))
})

app.listen(3000, () => console.log("Run on port 3000"))

// Maximum character length for the hash portion of the URL is 6
function makeShortenerUrl(){
    var maxLength = 6;
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < maxLength; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

//Check url if exist
async function isExistUrl(url){
    var isExist = 0;
    for(i = 0; i<urlList.length;i++){
        if( url == urlList[i].original){
            isExist = 1;
            break;
        }
    }
    return isExist;
}

//Get original url if short url exist in urlList array
async function getOriginalUrlByShortUrl(shortUrl){
    var url = "";
    for(i = 0; i<urlList.length; i++){
        if(urlList[i].shortened == shortUrl){
            url = urlList[i].original;
            break;
        }
    }
    return url;
}