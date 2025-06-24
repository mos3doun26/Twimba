import { tweetsData } from "./data.js"
import { v4 as uuidv4 } from 'https://cdn.skypack.dev/uuid';


document.getElementById('tweet-btn').addEventListener('click', newTweet)
document.getElementById('user-data-btn').addEventListener('click', handleClosingModal)
document.getElementById('user-img').addEventListener('change', saveUploadImg)

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
    else if (e.target.id === 'reply-btn') {
        addComment(e)
    }
})

// handle click on retweet icon
function handleClickRetweet(e) {
    const targetTweetObj = getTweetById(e.target.dataset.retweet)
    targetTweetObj.isRetweeted ? targetTweetObj.retweets-- : targetTweetObj.retweets++
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    e.target.parentElement.querySelector('span').innerText = targetTweetObj.retweets
    e.target.classList.toggle('retweeted')
    updataLocalStorage()
}

// handle click on heart icon
function handleClickHeart(e) {
    const targetTweetObj = getTweetById(e.target.dataset.heart)
    targetTweetObj.isLiked ? targetTweetObj.likes-- : targetTweetObj.likes++
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    e.target.parentElement.querySelector('span').innerText = targetTweetObj.likes
    e.target.classList.toggle('liked')
    updataLocalStorage()
}

//handle click on reply icon
function handleClickReply(e) {
    document.getElementById(`replies-${e.target.dataset.reply}`).classList.toggle('hidden')
}


// get the tweet by it's uuid
function getTweetById(tweetId) {
    return tweets.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0]
}

// adding new tweet
function newTweet() {
    const tweetInput = document.getElementById('tweet-input')
    const handle = localStorage.getItem('username') ? `@${localStorage.getItem('username')}` : '@Scrimbauser'
    const profilePic = localStorage.getItem('user-img') ? JSON.parse(localStorage.getItem('user-img')).dataUrl : 'images/scrimbalogo.png'
    if (tweetInput.value) {
        const tweet = {
            handle: handle,
            profilePic: profilePic,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4(),
        }
        tweets.unshift(tweet)
        tweetInput.value = ''
        updataLocalStorage()
        render()
    }
}

// add comment on a tweet
function addComment(e) {
    const targetTweetObj = getTweetById(e.target.dataset.newReply)
    const replyInput = document.getElementById(`reply-input-${targetTweetObj.uuid}`)
    const handle = localStorage.getItem('username') ? `@${localStorage.getItem('username')}` : '@Scrimbauser'
    const profilePic = localStorage.getItem('user-img') ? JSON.parse(localStorage.getItem('user-img')).dataUrl : 'images/scrimbalogo.png'
    if (replyInput.value) {
        targetTweetObj.replies.push({
            handle: handle,
            profilePic: profilePic,
            tweetText: replyInput.value,
        })
        document.getElementById(`replies-${targetTweetObj.uuid}`).innerHTML = getRepliesHtml(targetTweetObj)
        replyInput.value = ''
        updataLocalStorage()
    }
    // increament the replies
    document.getElementById(`replies-counter-${targetTweetObj.uuid}`).innerText = targetTweetObj.replies.length

}

function getRepliesHtml(tweet) {
    const profilePic = localStorage.getItem('user-img') ? JSON.parse(localStorage.getItem('user-img')).dataUrl : 'images/scrimbalogo.png'
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
    repliesHtml += `
    <div class="add-reply">
        <div class="tweet-inner">
            <img src="${profilePic}" class="profile-pic">
            <textarea class="reply-input" id="reply-input-${tweet.uuid}" placeholder="leave a comment"></textarea>
        </div>
        <button class="reply-btn" id="reply-btn" data-new-reply="${tweet.uuid}">Add Comment</button>
    </div>`
    return repliesHtml
}

// get feet html
function getFeedHtml() {
    let feedHtml = ``

    tweets.forEach(function (tweet) {
        // get details classes
        const heartLikedClass = tweet.isLiked ? 'liked' : ''
        const retweetedClass = tweet.isRetweeted ? 'retweeted' : ''

        // get the replies of the tweet is existed
        let repliesHtml = getRepliesHtml(tweet)

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
                                <span id="replies-counter-${tweet.uuid}">${tweet.replies.length}</span>
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${heartLikedClass}" id="heart" data-heart="${tweet.uuid}"></i>
                                <span>${tweet.likes}</span>
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetedClass}" id="retweet" data-retweet="${tweet.uuid}"></i>
                                <span>${tweet.retweets}</span>
                            </span>
                        </div>
                        <div class="replies hidden" id="replies-${tweet.uuid}">
                            ${repliesHtml}
                    </div>
                </div>
            </div>`
    })
    return feedHtml
}

const tweetsInLocalStorage = JSON.parse(localStorage.getItem('tweets'));
const tweets = tweetsInLocalStorage ? tweetsInLocalStorage : tweetsData
if (tweetsInLocalStorage === null) {
    localStorage.setItem('tweets', JSON.stringify(tweets))
}

function updataLocalStorage() {
    localStorage.setItem('tweets', JSON.stringify(tweets))
}

function render() {
    document.getElementById('feed').innerHTML = getFeedHtml()
    if (localStorage.getItem('username') === null) {
        document.getElementById('profile-pic').src = './images/scrimbalogo.png'
    } else {
        document.getElementById('profile-pic').src = JSON.parse(localStorage.getItem('user-img')).dataUrl
    }
}

document.addEventListener('DOMContentLoaded', render)

// handle click on submit button and close modal 
function handleClosingModal(e) {
    e.preventDefault()
    localStorage.setItem('username', document.getElementById('username').value)
    if (document.getElementById('username').value && document.getElementById('user-img').value) {
        document.getElementById('modal').style.display = 'none'
    }
    render()
}

// save uploead image data in local storage
function saveUploadImg(e) {
    const imgFile = e.target.files[0]
    const reader = new FileReader()
    reader.onload = function (event) {
        const currentImageData = {
            name: imgFile.name,
            type: imgFile.type,
            dataUrl: event.target.result
        }

        localStorage.setItem("user-img", JSON.stringify(currentImageData))
    }

    if (imgFile) {
        reader.readAsDataURL(imgFile)
    }
}

// loading modal after 5 seconds
if (localStorage.getItem('username') === null) {
    setTimeout(function () {
        document.getElementById('modal').style.display = 'flex'
    }, 5000);
}