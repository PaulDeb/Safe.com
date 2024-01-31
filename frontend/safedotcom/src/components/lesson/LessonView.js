import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertFromRaw } from 'draft-js';
import { HttpGetRequest, HttpPatchRequest } from "../../tools/HttpRequests";
import { NotificationManager } from "react-notifications";

import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { AiOutlineLoading } from "react-icons/ai";
import { GrClose } from "react-icons/gr";


import "../../scss/lesson_view.scss";

const LessonView = () => {
    const [loading, setLoading] = useState(true);
    const [lesson, setLesson] = useState(null);
    const [editor, setEditor] = useState(null);
    const [quiz, setQuiz] = useState([]);
    const [quizAnswers, setQuizAnswers] = useState([]);
    const [validated, setValidated] = useState(false);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getLesson();
    },[]);// eslint-disable-line

    const getLesson = () => {
        HttpGetRequest("/lesson/" + params.lessonId)
        .then((response) => {
            if (!response.ok) {
                throw response.status;
            }
            return response.json();
        }).then(data => {
            let myEditor = JSON.parse(data.data.editor);
            let myConvertedEditor;

            if (!!data.data.editor) {
                myConvertedEditor = convertFromRaw(myEditor);
            }

            setLesson(data);
            setEditor(EditorState.createWithContent(myConvertedEditor));
            setQuiz(JSON.parse(JSON.stringify(data.data.quiz)));
            resetAnswers(JSON.parse(JSON.stringify(data.data.quiz)));
            setLoading(false);
        }).catch((error) => {
            console.log(error);
            NotificationManager.error("Une erreur est survenue lors de la récupération des données!");
            setLoading(false);
        });
    };

    const resetAnswers = (newQuizAnswers) => {
        newQuizAnswers.forEach(item => {
            item.answers.forEach(answer => {
                answer.correct = false;
            });
        });

        setQuizAnswers(newQuizAnswers);
    };

    const onClickAnswer = (index, quizIndex, value) => {
        let updatedQuizAnswers = [...quizAnswers];

        updatedQuizAnswers[quizIndex].answers[index].correct = value;

        setQuizAnswers(updatedQuizAnswers);
    };

    const onValidate = () => {
        if (!!validated) {
            resetAnswers(JSON.parse(JSON.stringify(quiz)));
            setValidated(!validated);
            return;
        }

        let error = false;

        quiz.forEach((_, index) => {
            if( checkErrors(index) === true ) {
                error = true;
            }
        })

        if (!error) {
            let user = sessionStorage.getItem('user');
            let lessonId = params.lessonId;
            let index = -1;

            if (!user) {
                NotificationManager.error("Erreur lors de la mise a jour de l'utilisateur.");
                return;
            }
            user = JSON.parse(user);

            if (user.lessonEnded.includes(lessonId)){
                setValidated(!validated);
                return;
            }

            index = user.lessonInProgress.indexOf(lessonId);
            if (index > -1) {
                user.lessonInProgress.splice(index, 1);
            }

            user.lessonEnded.push(lessonId);
        
            updateAccount(user);

            NotificationManager.success("Félicitation ! Vous avez validé la leçon !");
        }

        setValidated(!validated);
    };

    const updateAccount = (user) => {
        HttpPatchRequest("/account/" + user.id, user)
        .then((response) => {
            if (!response.ok) {
                throw response.status;
            }
            return response.json();
        }).then((_) => {
            sessionStorage.setItem('user', JSON.stringify(user))
        }).catch((error) => {
            console.log(error);
            NotificationManager.error("Une erreur est survenue lors de la mise à jours du compte !");
            setLoading(false);
        });
    }

    const getIconValidate = (currentValue, goodResponse) => {
        if (!!currentValue && !!goodResponse) {
            return (<FaCheck className="icon-validate-answer green" />);
        } else if (!!currentValue && !goodResponse) {
            return (<GrClose className="icon-validate-answer miss" />);
        }
        return (
            <input
                type="checkbox"
                className="answer-input"
                checked={false}
                readOnly
            />
        );
    };

    const displayAnswer = (item, index, quizIndex) => (
        <div key={quizIndex + "-" + index} className="answers-container">
            {(!!validated) ? getIconValidate(
                quizAnswers[quizIndex]?.answers[index]?.correct,
                quiz[quizIndex]?.answers[index]?.correct
            ) : (
                <input
                    type="checkbox"
                    className="answer-input"
                    checked={quizAnswers[quizIndex]?.answers[index]?.correct}
                    onChange={(e) => onClickAnswer(index, quizIndex, e.target.checked)}
                />
            )}
            <div className="answer-text">{item.answer || ""}</div>
        </div>
    );

    const checkErrors = (index) => {
        let numberOfErrors = 0;

        quiz[index].answers.forEach((answer, answerIndex) => {
            if (answer.correct !== quizAnswers[index].answers[answerIndex].correct) {
                numberOfErrors += 1;
            }
        });

        if (numberOfErrors > 0) {
            return true;
        }

        return false;
    }

    const displayQuiz = (item, index) => (
        <div key={index} className="quiz-container">
            <div className="quiz-question">
                {item.question}
            </div>
            <div 
                className={(!!validated) ? (
                    checkErrors(index) ? "quiz-answers invalid" : "quiz-answers valid"
                ) : (
                    "quiz-answers"
                )}
            >
                {item.answers.map((answer, answerIndex) => (
                    displayAnswer(answer, answerIndex, index)
                ))}
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
        <div className="lesson-view-container">
            <div className="lesson-view-toolbar">
                <MdOutlineArrowBackIosNew
                    className="lesson-view-back"
                    onClick={() => navigate("/cours/" + params.coursId + "/lessons")}
                />
            </div>
            <div className="lesson-view-title">
                {lesson?.title}
            </div>
            <div className="lesson-view-content">
                <Editor
                    editorState={editor}
                    readOnly
                    toolbarHidden
                />
            </div>
            <div className="lesson-view-quiz">
                {(quiz.map(displayQuiz))}
                <div className="quiz-btn-container">
                
                    <div
                        className="valid-quiz"
                        onClick={onValidate}
                    >
                        {(!!validated) ? "Recommencer" : "Validate"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonView;