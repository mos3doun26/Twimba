import { tweetsData } from "./data.js"
import { v4 as uuidv4 } from 'https://cdn.skypack.dev/uuid';


document.getElementById('tweet-btn').addEventListener('click', newTweet)

document.addEventListener('click', function (e) {
    if (e.target.id === 'reply') {
        handleClickReply(e)
    }
    else if (e.target.id === 'heart') {
        handleClickHeart(e)
    }
    else if (e.target.id === 'retweet') {
        handleClickRetweet(e)
    }
})

// handle click on retweet icon
function handleClickRetweet(e) {
    const targetTweetObj = getTweetById(e.target.dataset.retweet)
    targetTweetObj.isRetweeted ? targetTweetObj.retweets-- : targetTweetObj.retweets++
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render()
}

// handle click on heart icon
function handleClickHeart(e) {
    const targetTweetObj = getTweetById(e.target.dataset.heart)
    targetTweetObj.isLiked ? targetTweetObj.likes-- : targetTweetObj.likes++
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

//handle click on reply icon
function handleClickReply(e) {
    document.getElementById(`replies-${e.target.dataset.reply}`).classList.toggle('hidden')
}


// get the tweet by it's uuid
function getTweetById(tweetId) {
    return tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0]
}

// adding new tweet
function newTweet() {
    const tweetInput = document.getElementById('tweet-input')
    if (tweetInput.value) {
        const tweet = {
            handle: `@Mohamedsamir`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4(),
        }
        tweetsData.unshift(tweet)
        tweetInput.value = ''
        render()
    }
}

// get feet html
function getFeedHtml() {
    let feedHtml = ``

    tweetsData.forEach(function (tweet) {
        // get details classes
        const heartLikedClass = tweet.isLiked ? 'liked' : ''
        const retweetedClass = tweet.isRetweeted ? 'retweeted' : ''

        // get the replies of the tweet is existed
        let repliesHtml = ``
        if (tweet.replies) {
            tweet.replies.forEach(function (reply) {
                repliesHtml += `
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                        <div class="reply-info">
                            <p class="handel">${reply.handle}</p>
                            <p class="tweet-text">${reply.tweetText}</p>
                        </div>
                    </div>
                </div>`
            })
        }

        feedHtml += `
            <div class="tweet" id="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handel">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots" id="reply" data-reply="${tweet.uuid}"></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${heartLikedClass}" id="heart" data-heart="${tweet.uuid}"></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetedClass}" id="retweet" data-retweet="${tweet.uuid}"></i>
                                ${tweet.retweets}
                            </span>
                        </div>
                        <div class="replies hidden" id="replies-${tweet.uuid}">
                            ${repliesHtml}
                        </div>
                    </div>
                </div>
            </div>`
    })
    return feedHtml
}

function render() {
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()