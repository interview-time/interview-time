import axios from "axios";

export function sendFeedback(name, email, message, callback) {
    axios.request({
        url: 'https://hooks.slack.com/services/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',
        method: 'POST',
        data: { text: 'Name: ' + name + ' Email: ' + email + ' Message: ' + message },
        headers: {
            'Content-Type': 'application/json',
            'Accept': "application/json"
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