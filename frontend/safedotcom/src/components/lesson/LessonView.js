import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertFromRaw } from 'draft-js';
import { HttpGetRequest, HttpPatchRequest, HttpPostRequest } from "../../tools/HttpRequests";
import { NotificationManager } from "react-notifications";
import { Rating } from 'react-simple-star-rating';

import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { AiOutlineLoading } from "react-icons/ai";
import { GrClose } from "react-icons/gr";

import accountIconExpert from "../../assets/images/account_icon_expert.png";
import accountIconDebutant from "../../assets/images/account_icon_debutant.png";


import "../../scss/lesson_view.scss";

const LessonView = () => {
    const [loading, setLoading] = useState(true);
    const [lesson, setLesson] = useState(null);
    const [editor, setEditor] = useState(null);
    const [quiz, setQuiz] = useState([]);
    const [quizAnswers, setQuizAnswers] = useState([]);
    const [validated, setValidated] = useState(false);
    const [user, setUser] = useState({});
    const [ratingStars, setRatingStars] = useState(3.5);
    const [ratingText, setRatingText] = useState("");
    const [rates, setRates] = useState([]);
    const params = useParams();
    const navigate = useNavigate();
    let lessonId = params.lessonId;

    useEffect(() => {
        getLesson();
        getRates();

        let currentUser = sessionStorage.getItem('user');
        currentUser = JSON.parse(currentUser);
        setUser(currentUser);

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

    const getRates = () => {
        HttpGetRequest("/lesson/" + params.lessonId + "/rates")
        .then((response) => {
            if (!response.ok) {
                throw response.status;
            }
            return response.json();
        }).then(data => {
            console.log(data);
            setRates(data);
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

    const onClickFollow = () => {
        let currentUser = {...user};
        currentUser.lessonInProgress.push(lessonId);
        updateAccount(currentUser);
    };

    const onSumbitRating = () => {
        HttpPostRequest("/rate/", {
            text: ratingText,
            rate: ratingStars,
            creator: user.id,
            lesson: lessonId
        })
        .then((response) => {
            if (!response.ok) {
                throw response.status;
            }
            return response.json();
        }).then((data) => {
            console.log(data);
            NotificationManager.success("Merci d'avoir posté votre avis !");
        }).catch((error) => {
            console.log(error);
            NotificationManager.error("Une erreur est survenue lors de la mise à jours du compte !");
            setLoading(false);
        });
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
            let lessonId = params.lessonId;
            let index = -1;

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
            sessionStorage.setItem('user', JSON.stringify(user));
            setUser(user);
        }).catch((error) => {
            console.log(error);
            NotificationManager.error("Une erreur est survenue lors de la mise à jours du compte !");
            setLoading(false);
        });
    };

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
    };

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

    const userFollowingLesson = (user.lessonEnded.includes(lessonId) || user.lessonInProgress.includes(lessonId));

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
            {(userFollowingLesson) ? (
                <div className="lesson-view-content">
                    <Editor
                        editorState={editor}
                        readOnly
                        toolbarHidden
                    />
                </div>
            ) : (
                <>
                    <div className="lesson-view-content locked">
                        <Editor
                            editorState={editor}
                            readOnly
                            toolbarHidden
                            />
                    </div>
                    <div className="lesson-view-start" onClick={onClickFollow}>
                        Commencer le cours
                    </div>
                </>
            )}
            {(userFollowingLesson) ? (
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
            ) : null}
            <div className="rating-container">
                {(userFollowingLesson) ? (
                    <>
                        <div className="rating-title">
                            Avez vous apprécié ce cours ?
                        </div>
                        <div className="rating-form">
                            <div className="rating-stars-container">
                                <div className="rating-label">
                                    Laissez nous votre avis :
                                </div>
                                <Rating
                                    className="rating-stars"
                                    onClick={setRatingStars}
                                    value={ratingStars}
                                    allowFraction
                                />
                            </div>
                            <textarea
                                className="rating-text"
                                maxLength={300}
                                onChange={(e) => setRatingText(e.target.value)}
                                value={ratingText}
                            />
                            <div className="rating-submit" onClick={onSumbitRating}>
                                Envoyer
                            </div>
                        </div>
                    </>
                ) : null}

                <div className="ratings-list">
                    {rates.map((rate, index) => (
                        <div key={"rate-" + index} className="rate-item">
                            <div className="rate-header">
                                <div className="rate-account">
                                    {(!!rate.creator.expert) ? (
                                        <img
                                        src={accountIconExpert}
                                        alt="account-icon"
                                        className="rate-icon"
                                        />
                                        ) : (
                                            <img
                                            src={accountIconDebutant}
                                            alt="account-icon"
                                            className="rate-icon"
                                            />
                                            )}
                                    <div className="rate-name">{rate.creator.pseudo}</div>
                                </div>
                                <Rating 
                                    readonly
                                    className="rating-value"
                                    initialValue={rate.rate}
                                    allowFraction
                                />
                            </div>
                            <div className="rate-msg">
                                {rate.text}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LessonView;