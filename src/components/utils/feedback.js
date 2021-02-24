import axios from "axios";

export function sendFeedback(name, email, message, callback) {
    axios.request({
        url: process.env.REACT_APP_SLACK_FEEDBACK_URL,
        method: 'POST',
        data: { text: 'Name: ' + name + '\nEmail: ' + email + '\nMessage: ' + message },
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