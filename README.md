# InterviewTime REST API

## Set up on Mac
- Install .NET 6 SDK
- Create AWS profile
    - Create file `credentials` in folder `~/.aws/`. You can use these commands in terminal:
        `mkdir .aws`
        `cd .aws`
        `touch credentials`
        Then manually add file content like this:
        ```
        [default]
        aws_access_key_id=YOUR-ACCESS-KEY
        aws_secret_access_key=YOUR-SECRET
        ```
    - You can create a new user in AWS or use the existing one named `caf`. Once you have a user create credentials in the Security credentials tab.
    - Replace the placeholders in the `credentials` file with your key and secret.