import axios from "axios";

export function sendFeedback(name, email, message, callback) {
    setSlackMessage(
        'New request from Application\nName: ' + name + '\nEmail: ' + email + '\nMessage: ' + message,
        callback
    );
}

export function sendCategoryRequest(email, category, details, callback) {
    setSlackMessage(
        'New request from Application\nEmail: ' + email + '\nCategory: ' + category + '\nDetails: ' + details,
        callback
    );
}

function setSlackMessage(text, callback) {
    axios.request({
        url: process.env.REACT_APP_SLACK_FEEDBACK_URL,
        method: 'POST',
        data: { text: text },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': 'application/json',
        }
    })
        .then(res => {
            console.log(res.data)
            callback()
        })
        .catch(reason => {
            console.error(reason)
            callback()
        });
}