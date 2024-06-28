const axios = require('axios')
const env = require('dotenv')
env.config()
const url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${process.env.NEWS_API_KEY}`
function getNews(){
    axios.get(url)
        .then(response => {
            if (response.data.status === 'ok') {
                console.log(response.data.articles.forEach(articles=>{
                    console.log(articles.source.name)
                }))
                return response.data.articles
            }
            else {
                return 'Error fecting in api'
            }
        })
        .catch(error => {
            return `Error fetching news: ${error}`
        });
}
getNews()
module.exports = getNews