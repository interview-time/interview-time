# REST API

Interviewer.space REST API

## Get My Interview Templates

### Request

`GET https://api.interviewer.space/template`

## Create Interview Template

### Request

`POST https://api.interviewer.space/template`

    {
    "title": "Senior Android Engineer",
    "image": "https://img.talkandroid.com/uploads/2019/08/Android-10-New-Logo-Green-Color.jpg",
    "type": "Technical",
    "description": "This guid helps to evaluate overall knowledge about Android SDK.",
    "structure": {
        "header": "Hello world header",
        "footer": "Hello World footer",
        "groups": [
            {
                "name": "C#",
                "questions": [
                    {
                        "questionId": "ae420b5b-2cd1-4895-90a1-c6eeb61380a6",
                        "question": "What is Boxing and Unboxing in C#?"
                    },
                    {
                        "questionId": "cfa7e550-5a22-4738-979d-de0efed79fcb",
                        "question": "What is the difference between a struct and a class in C#?"
                    }
                ]
            },
            {
                "name": "JavaScript",
                "questions": [
                    {
                        "questionId": "567ebd2a-c083-4999-adee-40945909f783",
                        "question": "Explain Hoisting in javascript."
                    },
                    {
                        "questionId": "28be069c-3a24-4d0b-b7a3-5bcd1981366a",
                        "question": "Difference between “ == “ and “ === “ operators."
                    }
                ]
            }
        ]
    }

}

## Update Interview Template

### Request

`PUT https://api.interviewer.space/template`

    {
        "templateId": "1bb6724f-3e03-4a45-a38a-bde564fda95e",
        "title": "C# Engineer",
        "type": "Technical",
        "description": "This guid helps to evaluate overall knowledge about Android SDK.",
        "structure": {
            "header": "Introduce yourself",
            "footer": "Hello World footer",
            "groups": [
                {
                    "name": "C#",
                    "questions": [
                        {
                            "questionId": "ae420b5b-2cd1-4895-90a1-c6eeb61380a6",
                            "question": "What is Boxing and Unboxing in C#?"
                        },
                        {
                            "questionId": "cfa7e550-5a22-4738-979d-de0efed79fcb",
                            "question": "What is the difference between a struct and a class in C#?"
                        }
                    ]
                },
                {
                    "name": "JavaScript",
                    "questions": [
                        {
                            "questionId": "567ebd2a-c083-4999-adee-40945909f783",
                            "question": "Explain Hoisting in javascript."
                        },
                        {
                            "questionId": "28be069c-3a24-4d0b-b7a3-5bcd1981366a",
                            "question": "Difference between “ == “ and “ === “ operators."
                        }
                    ]
                }
            ]
        }
    }

## Delete Interview Template

### Request

`DELETE https://api.interviewer.space/template/{templateId}`

## Get Library of Templates

### Request

`GET https://api.interviewer.space/template/library`
