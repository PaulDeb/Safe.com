/* Swagger configuration */
const options = {
    openapi: 'OpenAPI 3',
    language: 'en-US',
    disableLogs: false,
    autoHeaders: true,
    autoQuery: true,
    autoBody: true
}

const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        version: '2.0.0',
        title: 'REST API',
        description: "API of the Safe.com App",
        contact: null,
    },
    host: 'localhost:4000',
    basePath: '/',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [{
        name: 'Account',
        description: "This route manage all the accounts like : login, register, delete"
    }, {
        name: 'Module',
        description: "This route manage all modules objects from creation until delete"
    }, {
        name: 'Rating',
        description: "This route manage all ratings of modules from creation until delete"
    }, {
        name: 'Lesson',
        description: "This route manage all lessons of modules from creation until delete"
    }],
    securityDefinitions: {},
    definitions: {
        account: {
            id: "accountId",
            pseudo: "JDoe",
            admin: false,
            expert: false,
            email: "jhon.doe@solutec.fr",
            lessonInProgess: ["lessonID"],
            lessonEnded: ["lessonID", "lessonID"],
            createdAt: "2024-01-16T10:57:57.604Z",
            updatedAt: "2024-01-16T10:57:57.604Z",
            deleteAt: "2024-01-16T10:57:57.604Z"
        },
        newAccount: {
            $pseudo: "JDoe",
            $email: "jhon.doe@solutec.fr",
            $password: "JDo3!#",
            $expert: false
        },
        updateAccount: {
            pseudo: "JDoe",
            expert: false,
            lessonInProgress: ["lessonId"],
            lessonEnded: ["lessonId", "lessonId"]
        },
        updatePassword: {
            $password: "JDo3!#",
            $newPassword: "NewJDo3!#"
        },
        login: {
            $email: "jhon.doe@solutec.fr",
            $password: "JDo3!#"
        },
        lesson: {
            id: "lessonId",
            title: "lessonName",
            expert: false,
            rates: ["rateId", "rateId"],
            data: [{
                type: "paragraph",
                text: "Some text ..."
            }, {
                type: "image",
                image: "base64:ASDasdasdkjahsdjahgduhagd"
            }, {
                type: "quiz",
                question: "do you know the way ?",
                answers: [{
                    text: "Response a",
                    correct: false
                }, {
                    text: "Response b",
                    correct: true
                }]
            }],
            createdAt: "2024-01-16T10:57:57.604Z",
            updatedAt: "2024-01-16T10:57:57.604Z",
            deleteAt: "2024-01-16T10:57:57.604Z"
        },
        newLesson: {
            $expert: false,
            $title: "grammaire",
            $data: [{
                type: "paragraph",
                text: "Some text ..."
            }, {
                type: "image",
                image: "base64:ASDasdasdkjahsdjahgduhagd"
            }, {
                type: "quiz",
                question: "do you know the way ?",
                answers: [{
                    text: "Response a",
                    correct: false
                }, {
                    text: "Response b",
                    correct: true
                }]
            }]
        },
        updateLesson: {
            expert: false,
            title: "grammaire",
            rates: ["rateId", "rateId"],
            data: [{
                type: "paragraph",
                text: "Some text ..."
            }, {
                type: "image",
                image: "base64:ASDasdasdkjahsdjahgduhagd"
            }, {
                type: "quiz",
                question: "do you know the way ?",
                answers: [{
                    text: "Response a",
                    correct: false
                }, {
                    text: "Response b",
                    correct: true
                }]
            }]
        },
        module: {
            id: "moduleId",
            name: "ModuleName",
            lessons: ["lessonId", "lessonId", "lessonId", "lessonId"],
            expert: false,
            difficulty: 3,
            createdAt: "2024-01-16T10:57:57.604Z",
            updatedAt: "2024-01-16T10:57:57.604Z",
            deletedAt: null
        },
        newModule: {
            $name: "ModuleName",
            $expert: false,
            $difficulty: 5,
        },
        updateModule: {
            name: "NewModuleName",
            expert: false,
            difficulty: 3,
        },
        rate: {
            id: "rateId",
            text: "Opinion of the user",
            rate: 3,
            creator: "accountId",
            createdAt: "2024-01-16T10:57:57.604Z",
            updatedAt: "2024-01-16T10:57:57.604Z",
            deletedAt: null
        },
        newRate: {
            $text: "Opinion of user",
            $rate: 3,
            $creator: "accountId",
            $lesson: "lessonId"
        }
    },
};

const outputFile = './docs/swagger.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);