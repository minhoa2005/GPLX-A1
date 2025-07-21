import React, { useContext, useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { userContext } from "../userContext";

const API_Q = "http://localhost:3002/questions";
const API_H = "http://localhost:3002/history";
const API_T = "http://localhost:3002/test";

const User = () => {
    const [qNum, setQNum] = useState(0);
    const [question, setQuestion] = useState([]);
    const [origin, setOrigin] = useState([]);
    const [answer, setAnswer] = useState({});
    const [history, setHistory] = useState([]);
    const [showDetailedResults, setShowDetailedResults] = useState(false);
    const [currentTestResults, setCurrentTestResults] = useState([]);

    const { user } = useContext(userContext);


    const fetchQuestions = async () => {
        try {
            const response = await axios.get(API_Q);
            if (response) {
                const questionsWithAnswerText = response.data.map(q => {
                    const idx = q.answer;
                    const correctAnswerText = q.options[idx - 1];
                    const shuffledOptions = [...q.options].sort(() => 0.5 - Math.random());
                    console.log(correctAnswerText)
                    return {
                        ...q,
                        options: shuffledOptions,
                        answer: correctAnswerText
                    };
                });
                setQuestion(questionsWithAnswerText);
                setOrigin(questionsWithAnswerText);
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    // const fetchTestDetail = async () => {
    //     try {
    //         const response = await axios.get(`${API_T}?userId=${user.id}`);

    //     }
    // }

    const fetchHistory = async () => {
        try {
            if (user) {
                const response = await axios.get(`${API_H}?userId=${user.id}`);
                if (response) {
                    setHistory(response.data);
                }
            }
            else {
                setHistory([]);
            }
        }
        catch (error) {
            window.alert('Lỗi: ', error);
        }
    }

    const fetchTestDetails = async (testTime) => {
        try {
            if (user) {
                const response = await axios.get(`${API_T}?userId=${user.id}&time=${testTime}`);
                if (response.data && response.data.length > 0) {
                    const testData = response.data[0];
                    if (testData.detailedResults) {
                        setCurrentTestResults(testData.detailedResults);
                        setShowDetailedResults(true);

                    } else {
                        window.alert('Không có dữ liệu chi tiết cho bài thi này');
                    }
                }
            }
        }
        catch (error) {
            console.error('Lỗi khi lấy chi tiết bài thi:', error);
            window.alert('Không thể lấy chi tiết bài thi');
        }
    }

    useEffect(() => {
        fetchQuestions();
        fetchHistory();
    }, [user]);


    const changeAnswer = (questionNum, option) => {
        setAnswer((prev) => ({
            ...prev,
            [questionNum]: option
        }))
        console.log(answer)
    }

    const checkAnswer = async () => {
        try {
            let result = 0;
            const testType = question.length === 200 ? '200 câu lý thuyết' : 'Đề thi ngẫu nhiên 25 câu'
            const questionLength = question.length;
            const detailedResults = [];
            if (window.confirm("Bạn có chắc chắn muốn nộp bài không ? ")) {
                question.forEach((q, index) => {
                    const userAnswer = answer[index] ? answer[index] : 'Không chọn';
                    const correctAnswer = q.answer;
                    const isCorrect = userAnswer === correctAnswer;
                    if (isCorrect) {
                        result++;
                    }
                    detailedResults.push({
                        questionId: q.id,
                        questionText: q.question_text,
                        options: q.options,
                        userAnswer: userAnswer,
                        correctAnswer: correctAnswer,
                        isCorrect: isCorrect
                    });
                    console.log(detailedResults)
                })
                const timestamp = Date.now();
                if (user) {
                    await axios.post(API_H, {
                        userId: user.id,
                        time: timestamp,
                        score: result,
                        total: questionLength,
                        type: testType
                    });
                    await axios.post(API_T, {
                        userId: user.id,
                        time: timestamp,
                        userAnswers: answer,
                        detailedResults: detailedResults,
                        score: result,
                        total: questionLength,
                        type: testType
                    });

                }
                setHistory((prev) => [...prev, { time: timestamp, score: result, total: questionLength, type: testType }]);
                setCurrentTestResults(detailedResults);
                setAnswer({});
                setQNum(0);
                window.alert(`Số câu đúng: ${result}/${question.length}`);
            }
        }
        catch (error) {
            console.error("Lỗi khi lưu bài làm:", error);
        }
    }

    const randomQuestion = () => {
        const typeA = origin.slice(0, 37).sort(() => 0.5 - Math.random()).slice(0, 7);
        const typeB = origin.slice(37, 99).sort(() => 0.5 - Math.random()).slice(0, 6);
        const typeC = origin.slice(99, 164).sort(() => 0.5 - Math.random()).slice(0, 4);
        const typeD = origin.slice(164, 199).sort(() => 0.5 - Math.random()).slice(0, 8);

        const randomQuestion = [...typeA, ...typeB, ...typeC, ...typeD];
        setQuestion(randomQuestion);
        setQNum(0);
        setAnswer({})
        console.log(question)
        console.log(origin)
    }

    const allQuestion = () => {
        setQuestion(origin);
        setQNum(0);
        setAnswer({})
    }
    return (
        <div className="container-fluid px-4 py-4 page-transition" style={{ minHeight: '100vh' }}>
            <div className="row g-4 mb-5">
                <div className="col-lg-8">
                    <div className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
                        <div className="bg-white" style={{ padding: '25px', borderRadius: '20px 20px 0 0' }}>
                            <div className="d-flex align-items-center mb-3">
                                <div className="me-3 fw-bold">
                                    Câu {qNum + 1} / {question.length}
                                </div>
                            </div>
                            <h4 className="mb-4">
                                {question[qNum]?.question_text}
                            </h4>
                            {question[qNum]?.image && (
                                <div className="mb-4 text-center">
                                    <img
                                        src={question[qNum].image}
                                        alt="Question"
                                        className="img-fluid rounded shadow-sm"
                                        style={{ maxHeight: '300px' }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-white" style={{ borderRadius: '0 0 20px 20px' }}>
                            <div className="row g-3">
                                {question[qNum]?.options.map((option, index) => (
                                    <div key={index}>
                                        <label
                                            className={`d-flex align-items-center p-3 rounded-3 border cursor-pointer`}
                                        >
                                            <input
                                                type="radio"
                                                name={qNum}
                                                value={option}
                                                checked={answer[qNum] === option}
                                                onChange={() => changeAnswer(qNum, option)}
                                                className="form-check-input"
                                            />
                                            <span className="ms-2">
                                                {option}
                                            </span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="shadow-lg border-0 mb-4" style={{ borderRadius: '20px' }}>
                        <div className="bg-white border-0 text-center py-3" style={{ borderRadius: '20px 20px 0 0' }}>
                            <h5 className="mb-0" >
                                Danh sách câu hỏi
                            </h5>
                        </div>
                        <div className="p-3">
                            <div
                                className="d-flex gap-2 flex-wrap justify-content-center"
                                style={{ maxHeight: '300px', overflowY: 'auto' }}
                            >
                                {question.map((q, index) => (
                                    <button
                                        key={index}
                                        className={`btn ${index === qNum ? 'btn-primary' : answer[index] !== undefined ? 'btn-success' : 'btn-outline-primary'}`}
                                        onClick={() => setQNum(index)}
                                        style={{
                                            width: '70px',
                                            height: '45px',
                                        }}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="card shadow-lg border-0 mb-4" style={{ borderRadius: '20px' }}>
                        <div className="card-body p-4">
                            <div className="d-grid gap-3">
                                <div className="row g-2">
                                    <div className="col-6">
                                        <button
                                            className="btn btn-outline-secondary w-100 py-2"
                                            onClick={() => setQNum(qNum - 1)}
                                            disabled={qNum === 0}
                                        >
                                            Trước
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button
                                            className="btn btn-outline-secondary w-100 py-2"
                                            onClick={() => setQNum(qNum + 1)}
                                            disabled={qNum === question.length - 1}
                                        >
                                            Tiếp
                                        </button>
                                    </div>
                                </div>
                                <button
                                    className="btn btn-success py-3"
                                    onClick={checkAnswer}
                                >
                                    <i className="fas fa-paper-plane me-2"></i>
                                    Nộp bài thi
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quiz Options */}
                    <div className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
                        <div className="bg-white border-0 text-center py-3" style={{ borderRadius: '20px' }}>
                            <h6 className="mb-0">
                                Tùy chọn bài thi
                            </h6>
                        </div>
                        <div className="p-3" style={{ borderRadius: '20px' }}>
                            <div className="d-grid gap-2">
                                <button
                                    className="btn btn-outline-primary py-2"
                                    onClick={randomQuestion}
                                >
                                    Đề thi ngẫu nhiên
                                </button>
                                <button
                                    className="btn btn-outline-info py-2"
                                    onClick={allQuestion}
                                >
                                    Ôn luyện 200 câu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12" >
                    <div className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
                        <div className=" bg-white border-0 py-4" style={{ borderRadius: '20px' }}>
                            <h4 className="mb-0 ms-2">
                                Lịch sử làm bài
                            </h4>
                        </div>
                        <div className="p-0" style={{ borderRadius: '20px' }}>
                            {history.length > 0 ? (
                                <div className="table-responsive" style={{ borderRadius: '20px' }}>
                                    <table className="table table-hover mb-0">
                                        <thead>
                                            <tr>
                                                <th className="py-3 px-4">
                                                    Lần thi
                                                </th>
                                                <th className="py-3 px-4">
                                                    Thời gian
                                                </th>
                                                <th className="py-3 px-4">
                                                    Kết quả
                                                </th>
                                                <th className="py-3 px-4">
                                                    Loại
                                                </th>
                                                <th className="py-3 px-4">
                                                    Hành động
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {history.map((h, index) => (
                                                <tr key={index}>
                                                    <td className="py-3 px-4">
                                                        <span className="">
                                                            #{index + 1}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4" >
                                                        {new Date(h.time).toLocaleString()}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="" >
                                                            {h.score}/{h.total}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {h.type}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => fetchTestDetails(h.time)}
                                                        >
                                                            Xem chi tiết
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <h5>
                                        Chưa có lịch sử làm bài
                                    </h5>
                                    <p className="text-muted">
                                        Hãy bắt đầu làm bài thi đầu tiên của bạn
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>



            {showDetailedResults && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Kết quả chi tiết</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowDetailedResults(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {currentTestResults.map((result, index) => (
                                    <div key={index} className="mb-4 p-3 border rounded">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6>Câu {index + 1}</h6>
                                            <span className={`badge ${result.isCorrect ? 'bg-success' : 'bg-danger'}`}>
                                                {result.isCorrect ? 'Đúng' : 'Sai'}
                                            </span>
                                        </div>
                                        <p className="fw-bold mb-2">{result.questionText}</p>
                                        <div className="mb-2">
                                            <small className="text-muted">Các lựa chọn:</small>
                                            <ul className="list-unstyled ms-3">
                                                {result.options.map((option, optIndex) => (
                                                    <>
                                                        <div className="d-flex gap-2">
                                                            <p>{optIndex + 1} - </p>
                                                            <li key={optIndex} className={`
                                                        ${optIndex === result.correctAnswer ? 'text-success fw-bold' : ''}
                                                        ${optIndex === result.userAnswer && !result.isCorrect ? 'text-danger' : ''}
                                                    `}>
                                                                {optIndex === result.correctAnswer && <i className="fas fa-check me-1"></i>}
                                                                {optIndex === result.userAnswer && !result.isCorrect && <i className="fas fa-times me-1"></i>}
                                                                {option}
                                                            </li>
                                                        </div>
                                                    </>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <small className="text-muted">Bạn đã chọn:</small>
                                                <p className={`mb-0 ${result.isCorrect ? 'text-success' : 'text-danger'}`}>
                                                    {result.userAnswer}
                                                </p>
                                            </div>
                                            <div className="col-md-6">
                                                <small className="text-muted">Đáp án đúng:</small>
                                                <p className="mb-0 text-success">
                                                    {result.correctAnswer}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowDetailedResults(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default User;