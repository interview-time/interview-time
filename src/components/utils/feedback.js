import axios from "axios";

export function sendFeedback(name, email, message, callback) {
    const formData = new FormData();
    formData.append("name", name)
    formData.append("email", email)
    formData.append("message", message)
    axios.post(
        "https://usebasin.com/f/0b23e9a682fe.json",
        formData,
        { headers: { Accept: "application/json" } })
        .then(res => {
            console.log(res.data)
            callback()
        })
        .catch(reason => {
            console.error(reason)
            callback()
        });
}