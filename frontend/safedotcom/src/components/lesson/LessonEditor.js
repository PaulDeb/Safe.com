import React, { useEffect, useState } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { useForm } from "react-hook-form";
import { HttpGetRequest, HttpPatchRequest } from "../../tools/HttpRequests";
import { NotificationManager } from "react-notifications";
import Switch from "../Switch";

import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { TfiSave } from "react-icons/tfi";
import { FaPlus, FaCheckCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";
import { AiOutlineLoading } from "react-icons/ai";


import "../../scss/lesson_editor.scss";
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const ToolbarOption = {
    options: [ 
        'inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign',
        'colorPicker', 'link', 'emoji', 'image'
    ],
}

const LessonEditor = () => {
    const [lesson, setLesson] = useState(null);
    const [editor, setEditor] = useState(null);
    const [quiz, setQuiz] = useState([]);
    const [loading, setLoading] = useState(true);
    const { register, setValue, getValues } = useForm();
    const params = useParams();
    const navigate = useNavigate();

    let user = sessionStorage.getItem("user");
    user = JSON.parse(user);

    useEffect(() => {
        if (!user.admin)
            return;

        getLesson();
    },[]);// eslint-disable-line

    if (!user.admin) {
        return (<Navigate to="/cours" />);
    }

    const getLesson = () => {
        HttpGetRequest("/lesson/" + params.lessonId)
        .then((response) => {
            if (!response.ok) {
                throw response.status;
            }
            return response.json();
        }).then(data => {
            let myEditor = JSON.parse((!!data.data.editor) ? data.data.editor : JSON.stringify(""));
            let myConvertedEditor = undefined;
            
            if (!!data.data.editor && !!myEditor) {
                myConvertedEditor = convertFromRaw(myEditor);
            }
            
            setLesson(data);
            setValue('name', data.title);
            if (!!myConvertedEditor) {

                setEditor(EditorState.createWithContent(myConvertedEditor));
            }
            else {
                setEditor(EditorState.createEmpty());
            } 
            setQuiz(data.data.quiz);
            setLoading(false);
        }).catch((error) => {
            console.log(error);
            NotificationManager.error("Une erreur est survenue lors de la récupération des données!");
            setLoading(false);
        });
    }

    const updateLesson = () => {
        const content = convertToRaw(editor.getCurrentContent());
        
        const form = getValues();
        let body = {
            expert: lesson.expert,
            title: form.name,
            data: {
                editor: JSON.stringify(content),
                quiz: quiz
            }
        };
        
        HttpPatchRequest("/lesson/" + params.lessonId, body)
        .then((response) => {
            if (!response.ok) {
                throw response.status;
            }
            return response.json();
        }).then(data => {
            NotificationManager.success("Modification enregistrée !");
        }).catch((error) => {
            console.log(error);
            NotificationManager.error("Une erreur est survenue lors de la mise à jour!");
            setLoading(false);
        });
    }

    const addQuiz = () => {
        const newQuiz = {
            question: "",
            answers: [],
        };

        setQuiz([...quiz, newQuiz]);
    };

    const onChangeQuestion = (index, value) => {
        let newValue = [...quiz];

        newValue[index].question = value;

        setQuiz(newValue);
    };

    const removeQuestion = (index) => {
        let newQuiz = [...quiz];

        newQuiz.splice(index, 1);

        setQuiz(newQuiz);
    };

    const addAnswer = (index) => {
        const newAnswer = {
            answer: '',
            correct: false
        };
        let newValue = [...quiz];

        newValue[index].answers = [...newValue[index].answers, newAnswer];

        setQuiz(newValue);
    };

    const onChangeAnswer = (index, quizIndex, value) => {
        let updatedQuiz = [...quiz];

        updatedQuiz[quizIndex].answers[index].answer = value;

        setQuiz(updatedQuiz);
    };

    const onClickCheckbox = (index, quizIndex) => {
        let updatedQuiz = [...quiz];
        let currentValue = updatedQuiz[quizIndex].answers[index].correct;

        updatedQuiz[quizIndex].answers[index].correct = !currentValue;

        setQuiz(updatedQuiz);
    };

    const removeAnswer = (index, quizIndex) => {
        let updatedQuiz = [...quiz];
        
        updatedQuiz[quizIndex].answers.splice(index, 1);

        setQuiz(updatedQuiz);
    };

    const displayAnswers = (item, index, quizIndex) => (
        <div key={index + "-" + quizIndex} className="answer-container">
            <input
                className="answer-text-input"
                type="text"
                placeholder="Entrez une réponse"
                value={item.answer}
                onChange={(e) => onChangeAnswer(index, quizIndex, e.target.value)}
            />
            {(!!item.correct) ? (
                <FaCheckCircle
                    className="answer-checkbox-input checked"
                    onClick={() => onClickCheckbox(index, quizIndex)}
                />
            ) : (
                <IoMdCloseCircle
                    className="answer-checkbox-input"
                    onClick={() => onClickCheckbox(index, quizIndex)}
                />
            )}

            <IoClose
                className="answer-remove-btn"
                onClick={() => removeAnswer(index, quizIndex)}
            />
        </div>
    );

    const displayQuiz = (item, index) => (
        <div key={index} className="quiz-item-container">
            <div className="quiz-item-question">
                <input
                    className="quiz-item-question-input"
                    type="text"
                    value={item.question}
                    placeholder="Entrez une question"
                    onChange={(e) => { onChangeQuestion(index, e.target.value); }}
                />
                <FaPlus
                    className="quiz-item-add-question"
                    title="Ajouter une réponse"
                    onClick={() => addAnswer(index)}
                />
                <IoClose
                    className="quiz-item-remove"
                    title="Supprimer la question"
                    onClick={() => removeQuestion(index)}
                />
            </div>
            <div className="quiz-item-answers">
                {(item.answers.length > 0) ? (
                    item.answers.map((answer, answerIndex) => (
                        displayAnswers(answer, answerIndex, index)
                    ))
                ) : (
                    <div className="quiz-no-answer">Aucune réponse créé !</div>
                )}
            </div>
        </div>
    );

    if (!!loading) {
        return (
            <div className="loading">
                <AiOutlineLoading className="loading-icon" />
                <> Loading ... </>
            </div>
        )
    }

    return (
        <div className="lesson-editor-container">
            <div className="toolbar">
                <MdOutlineArrowBackIosNew
                    className="editor-lesson-icon back"
                    onClick={() => navigate("/cours/" + params.coursId + "/lessons/")}
                />
                <TfiSave
                    className="editor-lesson-icon save"
                    onClick={updateLesson}
                />
            </div>
            <form className="lesson-form">
                <div></div>
                <div>
                    <input
                        {...register("name")}
                        className="lesson-name"
                        type="text"
                    />
                </div>
                <div>
                    <Switch
                        value={lesson?.expert}
                        callback={(value) => setLesson({...lesson, expert: value})}
                    />
                </div>
            </form>
            <Editor
                editorState={editor}
                onEditorStateChange={setEditor}
                editorClassName="editor-class"
                toolbar={ToolbarOption}
                stripPastedStyles
            />
            <div className="quiz-container">
                <div className="quiz-title">
                    Quiz : 
                    <FaPlus
                        className="quiz-add"
                        onClick={addQuiz}
                    />
                </div>
                <div className="quiz">
                    {(quiz.length > 0) ? (
                        quiz.map(displayQuiz)
                    ) : (
                        <>Aucun quiz créé !</>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LessonEditor;