import React, { useContext, useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { userContext } from "../userContext";

const API_Q = "http://localhost:3001/questions";
const API_H = "http://localhost:3001/history";

const User = () => {
    const [qNum, setQNum] = useState(0);
    const [question, setQuestion] = useState([]);
    const [origin, setOrigin] = useState([]);
    const [answer, setAnswer] = useState({});
    const [history, setHistory] = useState([]);
    const { user } = useContext(userContext);


    const fetchQuestions = async () => {
        try {
            const response = await axios.get(API_Q);
            console.log("Response: ", response.data);
            if (response) {
                setQuestion(response.data);
                setOrigin(response.data);
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    console.log(user)

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

    useEffect(() => {
        fetchQuestions();
        fetchHistory();
    }, [user]);

    const handleChangeQuestion = (id) => {
        setQNum(id);
    }

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
            if (window.confirm("Bạn có chắc chắn muốn nộp bài không ? ")) {
                question.forEach((q, index) => {
                    if (answer[index] + 1 === parseInt(q.answer)) {
                        result++;
                    }
                })
                if (user) {
                    await axios.post(API_H, {
                        userId: user.id,
                        time: new Date().toLocaleDateString(),
                        score: result,
                        total: questionLength,
                        type: testType
                    })
                }
                setHistory((prev) => [...prev, { time: new Date().toLocaleDateString(), score: result, total: questionLength, type: testType }]);
                setAnswer({});
                setQNum(0);
                window.alert(`Số câu đúng: ${result}/${question.length}`);
            }
        }
        catch (error) {

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
                                                checked={answer[qNum] === index}
                                                onChange={() => changeAnswer(qNum, index)}
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
                                <i className="fas fa-list-ol me-2"></i>
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
                                        className={`btn ${index === qNum ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => handleChangeQuestion(index)}
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
                                            onClick={() => handleChangeQuestion(qNum - 1)}
                                            disabled={qNum === 0}
                                        >
                                            Trước
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button
                                            className="btn btn-outline-secondary w-100 py-2"
                                            onClick={() => handleChangeQuestion(qNum + 1)}
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
                                                        {h.time}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="" >
                                                            {h.score}/{h.total}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {h.type}
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
        </div>
    );
}

export default User;